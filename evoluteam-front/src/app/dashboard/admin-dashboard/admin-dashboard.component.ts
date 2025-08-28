import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminStatsService } from './admin-stats.service';
import { Task } from '../../models/task.model';
import { ChartConfiguration, ChartOptions, ChartData } from 'chart.js';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 0;
  totalTeams = 0;
  totalSkills = 0;
  pendingRequests = 0;
  totalProjects = 0;
  totalTasks = 0;
  tasksPending = 0;
  tasksInProgress = 0;
  tasksFinished = 0;
  totalReviews = 0;
  totalPointTransactions = 0;
  averagePointsPerUser = 0;
  topTeam = '';
  topUser = '';

  // Chart toggles
  showTaskStatusChart = false;
  showTasksPerProjectChart = false;
  showTaskCompletionChart = false;
  showTaskStatusPerProjectChart = false;
  showUserSkillRadarChart = false;
  showUserSkillBarChart = false;
  showTaskPriorityPolarChart = false;

  priorityFullNames: { [key: string]: string[] } = {
    low: [],
    medium: [],
    high: [],
    critical: [],
  };
showNewCustomChart = false;

newCustomChartData: ChartData<'line'> = {
  labels: ['Label 1', 'Label 2', 'Label 3'],
  datasets: [
    { data: [10, 20, 30], label: 'Example Dataset', fill: false, borderColor: '#42A5F5' }
  ]
};

newCustomChartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'top' },
    title: { display: true, text: 'New Custom Chart Example' }
  }
};

toggleNewCustomChart(): void {
  this.showNewCustomChart = !this.showNewCustomChart;
}

  // Charts
  taskStatusChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Pending', 'In Progress', 'Finished'],
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#f39c12', '#3498db', '#2ecc71'] }],
  };
  taskStatusChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
  };

  tasksPerProjectChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ label: 'Tasks per Project', data: [], backgroundColor: '#3498db' }],
  };
  tasksPerProjectChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Projects' } },
      y: { beginAtZero: true, title: { display: true, text: 'Number of Tasks' } },
    },
  };

  taskCompletionChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{ label: 'Tasks Completed', data: [], fill: false, borderColor: '#2ecc71', tension: 0.3 }],
  };
  taskCompletionChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Week' } },
      y: { beginAtZero: true, title: { display: true, text: 'Completed Tasks' } },
    },
  };

  taskStatusPerProjectChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  taskStatusPerProjectChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: { stacked: true, title: { display: true, text: 'Projects' } },
      y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Number of Tasks' } },
    },
    plugins: { legend: { position: 'top' } },
  };

  taskPriorityPolarChartData: ChartConfiguration<'polarArea'>['data'] = {
    labels: ['Low (0)', 'Medium (0)', 'High (0)', 'Critical (0)'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#2ecc71', '#f1c40f', '#e67e22', '#e74c3c'],
    }],
  };
  taskPriorityPolarChartOptions: ChartOptions<'polarArea'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const index = context.dataIndex;
            const keys = ['low', 'medium', 'high', 'critical'];
            const key = keys[index];
            const names = this.priorityFullNames?.[key] || [];
            return names.length > 0 ? `${label}: ${names.join(', ')}` : `${label}: No tasks`;
          },
        },
      },
    },
  };

  userSkillBarChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  userSkillBarChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'User Skill Levels' },
    },
    scales: {
      x: { title: { display: true, text: 'Skills' } },
      y: { beginAtZero: true, title: { display: true, text: 'Skill Level' }, max: 100 },
    },
  };

  private userColorMap = new Map<string, string>();

  constructor(private router: Router, private statsService: AdminStatsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.statsService.getTotalUsers().subscribe((count) => {
      this.totalUsers = count;
      this.statsService.getPointHistory().subscribe((points) => {
        this.totalPointTransactions = points.length;
        const totalPoints = points.reduce((sum, p) => sum + p.points, 0);
        this.averagePointsPerUser = this.totalUsers ? Math.round(totalPoints / this.totalUsers) : 0;
      });
    });

    this.statsService.getTotalTeams().subscribe((count) => this.totalTeams = count);
    this.statsService.getTotalSkills().subscribe((count) => this.totalSkills = count);
    this.statsService.getPendingSkillRequests().subscribe((count) => this.pendingRequests = count);
    this.statsService.getTotalProjects().subscribe((count) => this.totalProjects = count);
    this.statsService.getTotalReviews().subscribe((count) => this.totalReviews = count);

    this.statsService.getAllTasks().subscribe((tasks) => this.processTaskData(tasks));

    this.statsService.getTopPerformingUser().subscribe((name) => this.topUser = name);
    this.statsService.getTopPerformingTeam().subscribe((name) => this.topTeam = name);

    this.loadUserSkillsChart();
  }

  loadUserSkillsChart() {
    this.statsService.getUserSkillLevelsFromRequests().subscribe((usersSkills) => {
      if (!usersSkills || usersSkills.length === 0) {
        this.userSkillBarChartData.labels = [];
        this.userSkillBarChartData.datasets = [];
        return;
      }

      const allSkillNamesSet = new Set<string>();
      usersSkills.forEach(user => {
        user.skillLevels.forEach(skill => allSkillNamesSet.add(skill.skillName));
      });
      const allSkillNames = Array.from(allSkillNamesSet);

      const datasets = usersSkills.map(user => {
        const data = allSkillNames.map(skillName => {
          const skill = user.skillLevels.find(s => s.skillName === skillName);
          return skill ? skill.level : 0;
        });
        const color = this.getColorForUser(user.userName);
        return {
          label: user.userName,
          data,
          backgroundColor: color,
        };
      });

      this.userSkillBarChartData.labels = allSkillNames;
      this.userSkillBarChartData.datasets = datasets;
    });
  }

  processTaskData(tasks: Task[]) {
    this.totalTasks = tasks.length;
    this.tasksPending = this.statsService.countTasksByStatus(tasks, 'PENDING');
    this.tasksInProgress = this.statsService.countTasksByStatus(tasks, 'IN_PROGRESS');
    this.tasksFinished = this.statsService.countTasksByStatus(tasks, 'COMPLETED');

    this.taskStatusChartData.datasets[0].data = [
      this.tasksPending,
      this.tasksInProgress,
      this.tasksFinished,
    ];

    const projectTaskCount = new Map<string, number>();
    tasks.forEach((task) => {
      const title = task.project?.title ?? 'Unassigned';
      projectTaskCount.set(title, (projectTaskCount.get(title) || 0) + 1);
    });

    this.tasksPerProjectChartData.labels = Array.from(projectTaskCount.keys());
    this.tasksPerProjectChartData.datasets[0].data = Array.from(projectTaskCount.values());

    const statusMap = new Map<string, { pending: number; inProgress: number; completed: number }>();
    tasks.forEach((task) => {
      const title = task.project?.title ?? 'Unassigned';
      const entry = statusMap.get(title) || { pending: 0, inProgress: 0, completed: 0 };
      if (task.status === 'PENDING') entry.pending++;
      else if (task.status === 'IN_PROGRESS') entry.inProgress++;
      else if (task.status === 'COMPLETED') entry.completed++;
      statusMap.set(title, entry);
    });

    const labels = Array.from(statusMap.keys());
    this.taskStatusPerProjectChartData.labels = labels;
    this.taskStatusPerProjectChartData.datasets = [
      { label: 'Pending', backgroundColor: '#f39c12', data: labels.map(p => statusMap.get(p)?.pending ?? 0) },
      { label: 'In Progress', backgroundColor: '#3498db', data: labels.map(p => statusMap.get(p)?.inProgress ?? 0) },
      { label: 'Completed', backgroundColor: '#2ecc71', data: labels.map(p => statusMap.get(p)?.completed ?? 0) },
    ];

    this.calculatePriorityDistribution(tasks);
  }

  calculatePriorityDistribution(tasks: Task[]) {
    const now = new Date();
    const dist = {
      critical: { count: 0, names: [] as string[] },
      high: { count: 0, names: [] as string[] },
      medium: { count: 0, names: [] as string[] },
      low: { count: 0, names: [] as string[] },
    };

    tasks.forEach(task => {
      if (task.status !== 'IN_PROGRESS') return;

      let key: keyof typeof dist = 'low';
      if (task.dueDate) {
        const days = Math.ceil((new Date(task.dueDate).getTime() - now.getTime()) / (1000 * 3600 * 24));
        if (days <= 2) key = 'critical';
        else if (days <= 7) key = 'high';
        else if (days <= 14) key = 'medium';
      }

      dist[key].count++;
      dist[key].names.push(task.title);
    });

    this.priorityFullNames = {
      low: dist.low.names,
      medium: dist.medium.names,
      high: dist.high.names,
      critical: dist.critical.names,
    };

    this.taskPriorityPolarChartData.labels = [
      `Low (${dist.low.count})`,
      `Medium (${dist.medium.count})`,
      `High (${dist.high.count})`,
      `Critical (${dist.critical.count})`,
    ];
    this.taskPriorityPolarChartData.datasets[0].data = [
      dist.low.count,
      dist.medium.count,
      dist.high.count,
      dist.critical.count,
    ];
  }

  getColorForUser(userName: string): string {
    if (this.userColorMap.has(userName)) return this.userColorMap.get(userName)!;
    const colors = ['#36a2eb', '#ff6384', '#ff9f40', '#4bc0c0', '#9966ff', '#ffcd56', '#c9cbcf'];
    const color = colors[this.userColorMap.size % colors.length];
    this.userColorMap.set(userName, color);
    return color;
  }

  // Toggle methods
  toggleTaskStatusChart() { this.showTaskStatusChart = !this.showTaskStatusChart; }
  toggleTasksPerProjectChart() { this.showTasksPerProjectChart = !this.showTasksPerProjectChart; }
  toggleTaskCompletionChart() {
    this.showTaskCompletionChart = !this.showTaskCompletionChart;
    if (this.showTaskCompletionChart) {
      alert('Task Completion Over Time chart disabled: no completion dates available.');
      this.showTaskCompletionChart = false;
    }
  }
  toggleTaskStatusPerProjectChart() { this.showTaskStatusPerProjectChart = !this.showTaskStatusPerProjectChart; }
  toggleUserSkillRadarChart() { this.showUserSkillRadarChart = !this.showUserSkillRadarChart; }
  toggleUserSkillBarChart() { this.showUserSkillBarChart = !this.showUserSkillBarChart; }
  toggleTaskPriorityPolarChart() { this.showTaskPriorityPolarChart = !this.showTaskPriorityPolarChart; }

  // Routing methods
  navigateToUsers() { this.router.navigate(['/users']); }
  navigateToPoints() { this.router.navigate(['/points/history']); }
  navigateToTeams() { this.router.navigate(['/teams']); }
  navigateToTeamHistory() { this.router.navigate(['/teams/history']); }
  navigateToProjectManager() { this.router.navigate(['/projectmanager/projects']); }
  navigateToProjectHistory() { this.router.navigate(['/projectmanager/project-history']); }
  navigateToTasks() { this.router.navigate(['/projectmanager/tasks']); }
  navigateToReviews() { this.router.navigate(['/reviews']); }
  navigateToSkills() { this.router.navigate(['/skills']); }
  navigateToSkillRequests() { this.router.navigate(['/skills/requests']); }
}