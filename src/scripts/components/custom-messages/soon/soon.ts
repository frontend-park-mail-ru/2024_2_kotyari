import { rootId } from '../../../../services/app/config';
import soonTemplate from './soon.hbs?raw';
import Handlebars from 'handlebars';
import { router } from '../../../../services/app/init';

const compiled = Handlebars.compile(soonTemplate);

export function soon() :void{
  const root = document.getElementById(rootId)
  if(!root) return;

  root.innerHTML = '';


  const div = document.createElement('div');
  div.innerHTML = compiled();

  root.appendChild(div);

  const elem = document.getElementById('return-msg');
  elem?.addEventListener('click', (_) => {
    router.back()
  })
}