// Initialising the variables

type candidateData =
  {
   index : string;
   name : string;
   image : string;
   votes : int
  }

type inputParam =
  {
   index : string;
   name : string;
   image : string
  }

type startParameter = inputParam list * int * string

type voteParameter = string

type winner_dets =
  {
   winner : string;
   votes : int
  }

type candidateMap = (string, candidateData) map

type entryPoints =
| Start of startParameter
| Vote of voteParameter
| GetWinner

// Defining the storage

type storage =
  {
   admin : address;
   title : string;
   candidates : (string, candidateData) map;
   voting_end_time : timestamp;
   vote_started : bool;
   voters : (address, bool) map;
   winner_details : winner_dets;
   metadata : (string, bytes) big_map
  }

type returnType = operation list * storage

// First Entrypoint

let start (params, store : startParameter * storage) : returnType =
  // Check if currrent account was admin

  if Tezos.get_source () <> store.admin
  then (failwith "Admin not recognized" : returnType)
  else
    // Check if current voting session is not on

    if store.vote_started
    then (failwith "Voting session is on" : returnType)
    else
      let (param, voting_duration, title) = params in
      // Iterate through list of names supplied by admin and add them to the mapping with an initial value of 0 votes, also initialise the voters map 
      // then store them in storage

      let addToMap (candidates_Mapping, data : candidateMap * inputParam)
      : (string, candidateData) map =
        Map.add
          data.index
          {
           index = data.index;
           name = data.name;
           image = data.image;
           votes = 0
          }
          candidates_Mapping in
      let new_candidates : (string, candidateData) map =
        List.fold_left addToMap store.candidates param in
      let voting_end_time = Tezos.get_now () + voting_duration in
      let store =
        {
          store with
            title = title;
            candidates = new_candidates;
            voting_end_time = voting_end_time;
            vote_started = true;
            voters = (Map.empty : (address, bool) map)
        } in
      (([] : operation list), store)

// Second Entrypoint

let vote (candidate_id, store : voteParameter * storage) : returnType =
  // check if voting has started or ended

  if not store.vote_started
  then (failwith "Voting session has not started" : returnType)
  else
    if Tezos.get_now () > store.voting_end_time
    then (failwith "Voting has Ended" : returnType)
    else
      // check if voter has paid voting fee

      if Tezos.get_amount () < 500000mutez
      then (failwith "You need a minimum of 0.5tezos to vote" : returnType)
      else
        // keep record of the voters address

        let addr : address = Tezos.get_source () in
        // check if the voter himself has not already voted on the platform

        let hasVoted : bool =
          match Map.find_opt addr store.voters with
            Some x -> x
          | None -> false in
        if (hasVoted)
        then (failwith "Voter has already voted" : returnType)
        else
          // get the number of votes for the candidate 

          let candidate : candidateData =
            match Map.find_opt candidate_id store.candidates with
              Some k -> k
            | None -> (failwith "Candidate does not exist" : candidateData) in
          // add 1 to the votes

          let updateVotes : int = candidate.votes + 1 in
          // update the mapping of the candidates and store back in the storage

          let updateCandidate : candidateData =
            {candidate with votes = updateVotes} in
          let updated_candidate_votes =
            Map.update candidate_id (Some updateCandidate) store.candidates in
          // if he has not voted, update his status to become true

          let updated_voters : (address, bool) map =
            Map.add addr True store.voters in
          let store =
            {
              store with
                candidates = updated_candidate_votes; voters = updated_voters
            } in
          (([] : operation list), store)

// Third Entrypoint

let get_winner (store : storage) : returnType =
  // check if voting time has not ended

  if Tezos.get_now () < store.voting_end_time
  then (failwith "Voting session has not ended" : returnType)
  else
    // check if source is admin

    if Tezos.get_source () <> store.admin
    then (failwith "Admin not recognized" : returnType)
    else
      // now we iterate through the candidates mapping to extract the candidate with the highest number of votes

      let checkVotes (i, j : winner_dets * (string * candidateData))
      : winner_dets =
        let candidate : candidateData = j.1 in
        if i.votes > candidate.votes
        then i
        else
          {
           winner = candidate.index;
           votes = candidate.votes
          } in
      // this is actually the entrance point for checking for the highest votes, then we return a record, containing the name of the candidate
      // and the number of votes he has gotten, then store in storage.

      let winner_details : winner_dets =
        Map.fold
          checkVotes
          store.candidates
          {
           winner = "";
           votes = 0
          } in
      let store =
        {store with winner_details = winner_details; vote_started = false} in
      (([] : operation list), store)

let main (action, store : entryPoints * storage) : returnType =
  match action with
    Start params -> start (params, store)
  | Vote param -> vote (param, store)
  | GetWinner -> get_winner store
