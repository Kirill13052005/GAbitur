import Admin from "./pages/Admin";
import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";
import OrganizationPage from "./pages/OrganizationPage";
import JobPage from "./pages/JobPage";
import WorksPage from "./pages/WorksPage";
import AuthPage from "./pages/AuthPage";
import SkillPage from "./pages/SkillPage";

import { ADMIN_ROUTE, JOB_ROUTE, SKILL_ROUTE, WORKS_ROUTE, REGISTRATION_ROUTE, LOGIN_ROUTE, STUDENT_ROUTE, TEACHER_ROUTE, ORGANIZATION_ROUTE } from "./utils/consts";

// Маршруты, доступные только для авторизованных пользователей
export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    }
]

// Публичные маршруты (для неавторизованных пользователей)
export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: AuthPage
    },
    {
        path: REGISTRATION_ROUTE,
        Component: AuthPage
    },
    {
        path: JOB_ROUTE,
        Component: JobPage 
    },
    {
        path: SKILL_ROUTE,
        Component: SkillPage 
    },
    {
        path: WORKS_ROUTE,
        Component: WorksPage 
    },
    {
        path: STUDENT_ROUTE,
        Component: StudentPage 
    },
    {
        path: TEACHER_ROUTE,
        Component: TeacherPage
    },
    {
        path: ORGANIZATION_ROUTE,
        Component: OrganizationPage
    }
]