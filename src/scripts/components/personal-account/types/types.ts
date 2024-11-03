
export interface Account {
  name: string;
  photoUrl: string;
  gender: string;
  email: string;
  notifications: boolean;
  address: string;
}

export interface DeliveryInfo {
  class: string;
  iconClass: string;
  icon: string;
  detailsClass: string;
  titleClass: string;
  textClass: string;
  title: string;
  text: string;
  editable: boolean;
}

export interface FavoritesPurchaseInfo {
  class: string;
  iconClass: string;
  icon: string;
  detailsClass: string;
  titleClass: string;
  textClass: string;
  title: string;
  text: string;
}

export interface PersonalAccountData {
  deliveryInfo: DeliveryInfo[];
  rightColumnInfo: FavoritesPurchaseInfo[];
}
