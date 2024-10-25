import { personalAccountData } from '../views/personal-account-config';
import { PersonalAccountPage } from '../views/personal-account';

export async function buildAccountPage() {
    const page = new PersonalAccountPage(personalAccountData);
    await page.render();
}