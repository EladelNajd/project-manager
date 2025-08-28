import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SkillService } from '../skill.service';
import { Skill } from '../../models/skill.model';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
   styleUrls: ['./skill-list.component.scss'],
    encapsulation: ViewEncapsulation.None, // This line allows global styles
     providers: [MessageService]

 
})
export class SkillListComponent implements OnInit {
  skills: Skill[] = [];
  skillForm!: FormGroup;
  displayDialog: boolean = false;
  isEditing: boolean = false;
  selectedSkillId: number | null = null;

  constructor(
    private skillService: SkillService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.skillForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.loadSkills();
  }

  loadSkills(): void {
    this.skillService.getAllSkills().subscribe({
      next: (data) => this.skills = data,
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load skills' });
      }
    });
  }

  openAddDialog(): void {
    this.resetForm();
    this.displayDialog = true;
  }

  editSkill(skill: Skill): void {
    this.isEditing = true;
    this.selectedSkillId = skill.id!;
    this.skillForm.patchValue({ name: skill.name });
    this.displayDialog = true;
  }

  submit(): void {
    if (this.skillForm.invalid) return;
    const skillData = this.skillForm.value;

    if (this.isEditing && this.selectedSkillId !== null) {
      this.skillService.updateSkill(this.selectedSkillId, skillData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Skill updated successfully' });
          this.displayDialog = false;
          this.resetForm();
          this.loadSkills();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Update failed' });
        }
      });
    } else {
      this.skillService.createSkill(skillData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Skill created successfully' });
          this.displayDialog = false;
          this.resetForm();
          this.loadSkills();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Creation failed' });
        }
      });
    }
  }

  deleteSkill(id: number): void {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    this.skillService.deleteSkill(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Skill deleted successfully' });
        this.loadSkills();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Delete failed' });
      }
    });
  }

  resetForm(): void {
    this.skillForm.reset();
    this.isEditing = false;
    this.selectedSkillId = null;
  }

  goBack(): void {
    this.location.back();
  }
}
