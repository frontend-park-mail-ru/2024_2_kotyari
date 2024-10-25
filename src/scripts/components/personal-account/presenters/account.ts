import { personalAccountData } from '../views/personal-account-config';
import { renderPersonalAccountPage } from '../views/personal-account';

export async function buildAccountPage() {
    await renderPersonalAccountPage(personalAccountData);
}