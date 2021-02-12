import Component from '../components/base-component.js'
import { autobind } from '../decorators/autobind.js'
import { projectState } from '../state/project-state.js'
import * as Validation from '../util/validation.js'

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement
  descriptionInputElement: HTMLInputElement
  peopleInputElement: HTMLInputElement

  constructor() {
    super('project-input', 'app', true, 'user-input')
    this.titleInputElement = <HTMLInputElement>(
      this.element.querySelector('#title')
    )
    this.descriptionInputElement = <HTMLInputElement>(
      this.element.querySelector('#description')
    )
    this.peopleInputElement = <HTMLInputElement>(
      this.element.querySelector('#people')
    )
    this.configure()
  }

  renderContent() {}

  private gatherUsersInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value
    const enteredDescription = this.descriptionInputElement.value
    const enteredPeople = this.peopleInputElement.value

    const titleValidatable: Validation.Validatable = {
      value: enteredTitle,
      required: true,
      minLength: 1,
    }
    const descriptionValidatable: Validation.Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    }
    const peopleValidatable: Validation.Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 10,
    }

    if (
      !Validation.validate(titleValidatable) ||
      !Validation.validate(descriptionValidatable) ||
      !Validation.validate(peopleValidatable)
    ) {
      alert('please try again')
      return
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople]
    }
  }

  private clearInput() {
    this.titleInputElement.value = ''
    this.descriptionInputElement.value = ''
    this.peopleInputElement.value = ''
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUsersInput()
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput
      projectState.addProject(title, description, people)
      this.clearInput()
    }
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler)
  }
}
