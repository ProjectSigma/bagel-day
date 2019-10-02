import { BagelStatus } from "../enums/bagel-status";

// TODO: split types to separate files
export type Person = {
  name: string,
  status: BagelStatus,
  image: string
}

// TODO: split pieces to separate files
type State = {
  people: Person[]
}

export const state = () => ({
  people: []
})

type Getters = {
  currentPerson: (state: State) => Person,
  donePeople: (state: State) => Person[],
  notChosenPeople: (state: State) => Person[],
  notDonePeople: (state: State) => Person[],
  newPeople: (state: State) => Person[],
  isPersonChosen: (state: State) => boolean,
}

export const getters: Getters = {
  currentPerson: (state: State) => {
    const currentPerson = state.people.filter(person => person.status === BagelStatus.Current)

    if (currentPerson.length !== 1) {
      throw new Error("<> 1 person found as current")
    }

    return currentPerson[0];
  },
  donePeople: (state: State) => state.people.filter(person => person.status === BagelStatus.Done),
  notChosenPeople: (state: State) => state.people.filter(person => person.status === BagelStatus.NotChosen),
  notDonePeople: (state: State) => state.people.filter(person => person.status === BagelStatus.NotDone),
  newPeople: (state: State) => state.people.filter(person => person.status === BagelStatus.New),
  isPersonChosen: (state: State) => state.people.find(person => person.status === BagelStatus.Chosen) !== undefined,
}

export const mutations = {
  setPeople(state: State, people: Person[]) {
    // Never allow GONE people to appear in any way
    state.people = people.filter(person => person.status !== BagelStatus.Gone);
  },

  setNotChosen(state: State, person: Person) {
    person.status = BagelStatus.NotChosen
  },

  setChosen(state: State, person: Person) {
    person.status = BagelStatus.Chosen
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { app }) {
    const people = await app.$axios.$get(
      "./people.json"
    )
    commit("setPeople", people)
  },

  setNotChosen({ commit }, person: Person) {
    commit("setNotChosen", person)
  },

  setChosen({ commit }, person: Person) {
    commit("setChosen", person)
  }
}
