import { AdminPanelView } from '../view/view';
import { csrf } from '../../../../services/api/CSRFService';
import { getWithCred } from '../../../../services/api/without-csrf';

export class AdminPanelPresenter {
  private view: AdminPanelView;

  constructor(view: AdminPanelView) {
    this.view = view;

    console.log('constructor');
  }

  /**
   * Initializes the presenter by fetching data and binding view events.
   */
  init() {
    console.log('init');

    const questions = [
      {
        type: 'Site Feedback',
        rating: '5',
        count: 10,
        question: 'How satisfied are you with the website performance?',
      },
      {
        type: 'Customer Support',
        rating: '4.5',
        count: 8,
        question: 'How would you rate our customer support service?',
      },
    ];

    this.view.renderQuestions(questions);

    this.view.bindRestartQuestion((type) => this.handleRestart(type));
    this.view.bindDeleteQuestion((type) => this.handleDelete(type));
    this.view.bindEditQuestion((type) => this.handleEdit(type));
    this.view.bindSaveQuestion((type, newTitle) => this.handleSave(type, newTitle));
    this.view.bindCancelEdit((type) => this.handleCancelEdit(type));

    // csrf.fetchToken().then(() => {
    //   this.fetchQuestions()
    //     .then((questions) => {
    //       this.view.renderQuestions(questions);
    //       this.view.bindRestartQuestion((type) => this.handleRestart(type));
    //       this.view.bindDeleteQuestion((type) => this.handleDelete(type));
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    // });
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
      if (response.success) {
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

  /**
   * Fetches survey questions from the API.
   */
  private async fetchQuestions() {
    try {
      const response = await getWithCred('/csat_admin');
      if (response.status === 200) {
        return response.body.data.map((item: any) => ({
          type: item.type,
          rating: item.rating || 'N/A',
          count: item.count || 0,
          question: item.title || 'N/A',
        }));
      } else {
        console.error('Failed to fetch questions:', response.body.error_message);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    return [];
  }

  /**
   * Handles restarting a survey question.
   * @param type - The type of the question to restart.
   */
  private async handleRestart(type: string) {
    try {
      const response = await csrf.put('/csat_admin', { type });
      if (response.status == 200) {
        console.log('УСПЕШНО');
      } else {
        console.error('Failed to restart survey:', response.body.message);
      }
    } catch (error) {
      console.error('Error restarting survey:', error);
    }
  }

  /**
   * Handles deleting a survey question.
   * @param type - The type of the question to delete.
   */
  private async handleDelete(type: string) {
    try {
      const response = await csrf.delete('/csat_admin', { type });
      if (response.success) {
        alert(`Survey "${type}" deleted successfully!`);
        this.init(); // Refresh the list
      } else {
        console.error('Failed to fetch questions:', response.body.error_message);
      }
    } catch (error) {
      console.error('Error deleting survey:', error);
    }
  }
}
