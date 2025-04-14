import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employeeForm!: FormGroup;
  employees: any[] = [];
  isEditing: boolean = false;
  editingIndex: number = -1;
  showForm: boolean = false;
  editingId: string = '';

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {}

  ngOnInit() {
    this.initializeForm();
    this.loadEmployees();
  }

  initializeForm() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      employeeId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data.map(emp => ({ ...emp, showPassword: false }));
      },
      error: (err) => {
        console.error('Failed to load employees', err);
      }
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) return;
    const formValue = this.employeeForm.value;

    if (this.isEditing) {
      this.employeeService.updateEmployee(this.editingId, formValue).subscribe({
        next: () => {
          this.loadEmployees();
          this.showForm = false;
          this.resetForm();
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      this.employeeService.addEmployee(formValue).subscribe({
        next: () => {
          this.loadEmployees();
          this.showForm = false;
          this.resetForm();
        },
        error: (err) => console.error('Add failed', err)
      });
    }
  }

  onEdit(index: number) {
    const emp = this.employees[index];
    this.employeeForm.patchValue(emp);
    this.isEditing = true;
    this.editingIndex = index;
    this.editingId = emp._id;
    this.showForm = true;
  }

  onDelete(index: number) {
    const id = this.employees[index]._id;
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.loadEmployees();
        if (this.editingIndex === index) this.resetForm();
      },
      error: (err) => console.error('Delete failed', err)
    });
  }

  onCancel() {
    this.resetForm();
    this.showForm = false;
  }

  onAddNew() {
    this.resetForm();
    this.showForm = true;
  }

  resetForm() {
    this.employeeForm.reset();
    this.isEditing = false;
    this.editingIndex = -1;
    this.editingId = '';
  }

  togglePassword(emp: any): void {
    emp.showPassword = !emp.showPassword;
  }
}
