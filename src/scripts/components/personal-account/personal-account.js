import { TemplateManager } from '../../constprograms/templatizer/templatize.js';

const personalAccountTemplateURL = 'src/scripts/components/personal-account/personal-account.hbs';

export async function personalAccount(data) {
  await TemplateManager.templatize(document.getElementById('main'), personalAccountTemplateURL, data);
}
