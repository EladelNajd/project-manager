import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillService } from '../skill.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.scss'],

  providers: [MessageService]
})
export class SkillFormComponent {
  skillForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    private messageService: MessageService
  ) {
    this.skillForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.skillForm.invalid) return;

    this.skillService.createSkill(this.skillForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Skill created successfully' });
        this.skillForm.reset();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Creation failed' });
      }
    });
  }
}
