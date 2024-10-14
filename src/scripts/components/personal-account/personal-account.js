import { templatize } from '../../constprograms/templatizer/templatizer.js';

const personalAccountTemplateURL = 'src/scripts/components/personal-account/personal-account.hbs';

export async function personalAccount(data) {
  await templatize(document.getElementById('main'), personalAccountTemplateURL, data);
}
