import { createSiteElement } from '../util.js';

const createUserProfileTemplate = (userProfile) => {
  const {rank} = userProfile;

  return `
    <section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
};

export default class UserProfileView {
  constructor(userRank) {
    this._element = null;
    this._userRank = userRank;
  }

  getTemplate() {
    return createUserProfileTemplate(this._userRank);
  }

  getElement() {
    if(!this._element) {
      this._element = createSiteElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
