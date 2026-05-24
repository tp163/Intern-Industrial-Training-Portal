# Intern & Industrial Training System (Frontend)

A frontend-only Next.js 15 application for managing internships, applications, and industrial training progress.

## Tech Stack

- Next.js 15 (App Router)
- HeroUI
- Tailwind CSS
- TypeScript
- Lucide Icons
- next-themes (dark/light mode)

## Getting Started

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Login (Mock)

Use the login page and select a role (Student, Supervisor, or Admin). Any credentials work — you'll be redirected to the matching dashboard.

## Routes

### Authentication
- `/login`
- `/register`
- `/forgot-password`

### Student
- `/student/dashboard`
- `/student/profile`
- `/student/cv`
- `/student/applications`
- `/student/internships`

### Supervisor
- `/supervisor/dashboard`
- `/supervisor/students`
- `/supervisor/reviews`
- `/supervisor/reports`

### Admin
- `/admin/dashboard`
- `/admin/students`
- `/admin/supervisors`
- `/admin/companies`
- `/admin/internships`
- `/admin/reports`
- `/admin/settings`

## Project Structure

```
app/           # Next.js App Router pages
components/    # Reusable UI components
data/          # Mock JSON data
lib/           # Utilities and navigation config
types/         # TypeScript types
public/        # Static assets
```

## Notes

- Frontend only — no backend or API
- All data is mocked in `data/mock.ts`
- Match Figma spacing/colors using Dev Mode and update `tailwind.config.ts` as needed

## Windows Path Note

If your project folder contains `&` in the name, npm scripts use direct `node` paths to avoid Windows shell issues.
