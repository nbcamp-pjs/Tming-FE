import {atom} from "recoil";
import {recoilPersist} from "recoil-persist";

const {persistAtom} = recoilPersist()

export const userState = atom({
  key: 'userState',
  default: null,
  effects_UNSTABLE: [persistAtom]
})

export const accessTokenState = atom({
  key: 'accessTokenState',
  default: null,
  effects_UNSTABLE: [persistAtom]
})

export const refreshTokenState = atom({
  key: 'refreshTokenState',
  default: null,
  effects_UNSTABLE: [persistAtom]
})
