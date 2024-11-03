import { rootId } from '../../../../services/app/config';
import soonTemplate from './soon.hbs?raw';
import Handlebars from 'handlebars';

const compiled = Handlebars.compile(soonTemplate);

export function soon() :void{
  const root = document.getElementById(rootId)
  if(!root) return;

  root.innerHTML = '';


  const div = document.createElement('div');
  div.innerHTML = compiled({ return:'/' });

  root.appendChild(div);

}