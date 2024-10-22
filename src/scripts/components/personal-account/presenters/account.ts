import { personalAccountData } from '../personal-account-config';
import { renderPersonalAccountPage } from '../personal-account';

export async function buildAccountPage() {
    await renderPersonalAccountPage(personalAccountData);
}