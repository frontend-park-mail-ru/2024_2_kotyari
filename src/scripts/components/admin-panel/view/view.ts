import adminHBS from  './admin.hbs?raw'
import { rootId } from '../../../../services/app/config';
import Handlebars, { template } from 'handlebars';
import { csrf } from '../../../../services/api/CSRFService';

export class AdminPanelView {
  private compiled: any = null;

  renderQuestions(questions: Array<{ type: string, rating: string, count: number, question: string }>) {
    const container = document.getElementById(rootId);

    console.log(questions);

    if (!container) {
      console.error('НЕ НАЙДЕН root для CSAT');

      return;
    }

    container.innerHTML = '';
    const tmp = document.createElement('div');
    this.compiled = Handlebars.compile(adminHBS);

    console.log();

    tmp.innerHTML = this.compiled({ questions });

    container.appendChild(tmp);
  }

  bindRestartQuestion(handler: (type: string) => void) {
    const container = document.getElementById(rootId);
    if (!container) {
      console.error('НЕ НАЙДЕН root для CSAT');

      return;
    }

    container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('btn-restart')) {
        const type = target.dataset.type!;
        handler(type);
      }
    });
  }

  bindEditQuestion(handler: (type: string) => void) {
    const container = document.getElementById(rootId);
    if (!container) {
      console.error('НЕ НАЙДЕН root для CSAT');

      return;
    }

    container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('btn-edit')) {
        const type = target.dataset.type!;
        handler(type);
      }
    });
  }

  bindSaveQuestion(handler: (type: string, newTitle: string) => void) {
    const container = document.getElementById(rootId);
    if (!container) {
      console.error('НЕ НАЙДЕН root для CSAT');

      return;
    }

    container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('btn-save')) {
        const type = target.dataset.type!;
        const newTitle = (document.querySelector(`[data-type="${type}"] .edit-input`) as HTMLInputElement).value;
        handler(type, newTitle);
      }
    });
  }

  bindCancelEdit(handler: (type: string) => void) {
    const container = document.getElementById(rootId);
    if (!container) {
      console.error('НЕ НАЙДЕН root для CSAT');

      return;
    }

    container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('btn-cancel')) {
        const type = target.dataset.type!;
        handler(type);
      }
    });
  }


  private handleEdit(type: string) {
    const surveyElement = document.querySelector(`[data-type="${type}"]`);
    if (surveyElement) {
      surveyElement.querySelector('.edit-section')!.setAttribute('style', 'display: block;');
      surveyElement.querySelector('.config-actions')!.setAttribute('style', 'display: none;');
    }
  }

  private async handleSave(type: string, newTitle: string) {
    try {
      const response = await csrf.patch('/csat_admin', { type, new_title: newTitle });
      if (response.status == 200) {
        alert(`Survey "${type}" updated successfully!`);
        const surveyElement = document.querySelector(`[data-type="${type}"]`);
        if (surveyElement) {
          surveyElement.querySelector('.question-title')!.textContent = newTitle;
          this.handleCancelEdit(type); // Close edit mode
        }
      } else {
        console.error('Failed to update question:', response.body.error_message);
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  }

  private handleCancelEdit(type: string) {
    const surveyElement = document.querySelector(`[data-type="${type}"]`);
    if (surveyElement) {
      surveyElement.querySelector('.edit-section')!.setAttribute('style', 'display: none;');
      surveyElement.querySelector('.config-actions')!.setAttribute('style', 'display: block;');
    }
  }

  bindDeleteQuestion(handler: (type: string) => void) {
    const container = document.getElementById(rootId);
    if (!container) {
      console.error('НЕ НАЙДЕН root для CSAT');

      return;
    }

    container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('btn-delete')) {
        const type = target.dataset.type!;
        handler(type);
      }
    });
  }
}
