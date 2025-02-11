import {
    AlibabaOutlined,
    ArrowRightOutlined,
    ContactsOutlined,
    DatabaseOutlined,
    DownOutlined,
    HomeOutlined,
    ReconciliationOutlined,
    SecurityScanOutlined,
    UserAddOutlined,
    UserOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';
import Home from './components/admin/Home';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ForgetPassword from './components/auth/ForgetPassword';
import Profile from './components/admin/Profile';
import Manager from './components/admin/Manager';
import Users from './components/admin/user-crud/Users';
import AddUser from './components/admin/user-crud/AddUser';
import PageNotFound from './PageNotFound';
import AuthCMS from './components/admin/cms/AuthCMS';
import SocialCMS from './components/admin/cms/SocialCMS';
import HomeCMS from './components/admin/cms/HomeCMS';
import AboutUsCMS from './components/admin/cms/AboutUsCMS';
import ServiceInfoCMS from './components/admin/cms/ServiceInfoCMS';
import EprocurmentInfoCMS from './components/admin/cms/EprocurmentInfoCMS';
import ServiceRecordCMS from './components/admin/cms/ServiceRecordCMS';
import EprocurmentRecordCMS from './components/admin/cms/EprocurmentRecordCMS';
import ContactUsCMS from './components/admin/cms/ContactUsCMS';
import GrantInfoCMS from './components/admin/cms/GrantInfoCMS';
import TenderInfoCMS from './components/admin/cms/TenderInfoCMS';
import ProjectInfoCMS from './components/admin/cms/ProjectInfoCMS';
import ContractAwardInfoCMS from './components/admin/cms/ContractAwardInfoCMS';
import CountryMaster from './components/admin/master/CountryMaster';
import StateMaster from './components/admin/master/StateMaster';
import RegionMaster from './components/admin/master/RegionMaster';
import SectorMaster from './components/admin/master/SectorMaster';
import CPVCodeMaster from './components/admin/master/CPVCodeMaster';
import ContactUsCommon from './components/admin/common/ContactUsCommon';
import DemoRequestCommon from './components/admin/common/DemoRequestCommon';
import Grant from './components/admin/Grant';
import ContractAward from './components/admin/ContractAward';
import Project from './components/admin/Project';
import Tender from './components/admin/Tender';
import Customer from './components/admin/Customer';
import ActivationPanel from './components/admin/activation';
import Subscription from './components/admin/Subscription';
import CustomerReports from './components/admin/CustomerReports';
import DailyReports from './components/admin/DailyReports';
import { userRoles } from './utils/roles';
import CityMaster from './components/admin/master/CityMaster';

const icon = {
    className: 'w-5 h-5 text-inherit',
};

export const routes = [
    {
        layout: 'admin',
        pages: [
            {
                key: '1',
                icon: <HomeOutlined {...icon} />,
                name: 'Dashboard',
                path: '/',
                element: <Home />,
                children: [],
                access: [
                    userRoles.SALES,
                    userRoles.CONTENT_DEPARTMENT,
                    userRoles.CUSTOMERS,
                    userRoles.IT_SUPPORT,
                ],
                isSideBar: true,
            },
            {
                key: '3',
                icon: <UserOutlined {...icon} />,
                name: 'Profile',
                path: '/profile',
                element: <Profile />,
                isSideBar: false,
            },
            {
                key: '6',
                icon: <UserOutlined {...icon} />,
                name: 'PageNotFOund',
                path: '*',
                element: <PageNotFound />,
                children: [],
                isSideBar: false,
            },
            {
                key: '7',
                icon: <DownOutlined {...icon} />,
                name: 'CMS',
                path: '/cms',
                element: <Home />,
                showChildren: true,
                children: [
                    {
                        key: '73',
                        icon: <HomeOutlined {...icon} />,
                        name: 'Home Page',
                        path: '/cms/home',
                        element: <HomeCMS />,
                        // isSideBar: true
                    },
                    {
                        key: '71',
                        icon: <SecurityScanOutlined {...icon} />,
                        name: 'Auth Manager',
                        path: '/cms/auth',
                        element: <AuthCMS />,
                        // isSideBar: true
                    },
                    {
                        key: '72',
                        icon: <UserOutlined {...icon} />,
                        name: 'Social Links',
                        path: '/cms/social',
                        element: <SocialCMS />,
                        // isSideBar: true
                    },
                    {
                        key: '74',
                        icon: <AlibabaOutlined {...icon} />,
                        name: 'About Us',
                        path: '/cms/aboutus',
                        element: <AboutUsCMS />,
                        // isSideBar: true
                    },
                    {
                        key: '79',
                        icon: <ContactsOutlined {...icon} />,
                        name: 'Contact Us',
                        path: '/cms/contact-us',
                        element: <ContactUsCMS />,
                        // isSideBar: true
                    },
                    {
                        key: '75',
                        icon: <DatabaseOutlined {...icon} />,
                        name: 'Service Info',
                        path: '/cms/service-info',
                        element: <ServiceInfoCMS />,
                        // isSideBar: true
                    },
                    {
                        key: '76',
                        icon: <DatabaseOutlined {...icon} />,
                        name: 'Service Record',
                        path: '/cms/service-record',
                        element: <ServiceRecordCMS />,
                        // isSideBar: true
                    },
                    {
                        key: '77',
                        icon: <ReconciliationOutlined {...icon} />,
                        name: 'Eprocument Info',
                        path: '/cms/eprocument-Info',
                        element: <EprocurmentInfoCMS />,
                        // isSideBar: true
                    },
                    {
                        key: '78',
                        icon: <ReconciliationOutlined {...icon} />,
                        name: 'Eprocument Record',
                        path: '/cms/eprocument-record',
                        element: <EprocurmentRecordCMS />,
                        // isSideBar: true
                    },
                    {
                        key: '710',
                        icon: <ContactsOutlined {...icon} />,
                        name: 'Grant Info',
                        path: '/cms/grant',
                        element: <GrantInfoCMS />,
                        // isSideBar: true
                    },
                    {
                        key: '711',
                        icon: <ContactsOutlined {...icon} />,
                        name: 'Tender Info',
                        path: '/cms/tender',
                        element: <TenderInfoCMS />,
                        // isSideBar: true
                    },
                    {
                        key: '712',
                        icon: <ContactsOutlined {...icon} />,
                        name: 'Project Info',
                        path: '/cms/project',
                        element: <ProjectInfoCMS />,
                        // isSideBar: true
                    },
                    {
                        key: '713',
                        icon: <ContactsOutlined {...icon} />,
                        name: 'Contract Info',
                        path: '/cms/contract',
                        element: <ContractAwardInfoCMS />,
                        // isSideBar: true
                    },
                ],
                isSideBar: true,
            },
            {
                key: '8',
                icon: <DownOutlined {...icon} />,
                name: 'Master',
                path: '/master',
                element: <Home />,
                showChildren: true,
                children: [
                    {
                        key: '81',
                        icon: <HomeOutlined {...icon} />,
                        name: 'Countries',
                        path: '/master/country',
                        element: <CountryMaster />,
                        // isSideBar: true
                    },
                    {
                        key: '82',
                        icon: <SecurityScanOutlined {...icon} />,
                        name: 'States',
                        path: '/master/state',
                        element: <StateMaster />,
                        // isSideBar: true
                    },
                    {
                        key: '86',
                        icon: <SecurityScanOutlined {...icon} />,
                        name: 'Cities',
                        path: '/master/city',
                        element: <CityMaster />,
                        // isSideBar: true
                    },
                    {
                        key: '83',
                        icon: <UserOutlined {...icon} />,
                        name: 'Regions',
                        path: '/master/region',
                        element: <RegionMaster />,
                        // isSideBar: true
                    },
                    {
                        key: '84',
                        icon: <AlibabaOutlined {...icon} />,
                        name: 'Sectors',
                        path: '/cms/sector',
                        element: <SectorMaster />,
                        // isSideBar: true
                    },
                    {
                        key: '85',
                        icon: <ContactsOutlined {...icon} />,
                        name: 'CPV Codes',
                        path: '/cms/cpv-code',
                        element: <CPVCodeMaster />,
                        // isSideBar: true
                    },
                ],
                isSideBar: true,
            },
            {
                key: '9',
                icon: <DownOutlined {...icon} />,
                name: 'Common',
                path: '/common',
                element: <Home />,
                showChildren: true,
                children: [
                    {
                        key: '91',
                        icon: <HomeOutlined {...icon} />,
                        name: 'Contact Us',
                        path: '/common/contact-us',
                        element: <ContactUsCommon />,
                        // isSideBar: true
                    },
                    {
                        key: '92',
                        icon: <SecurityScanOutlined {...icon} />,
                        name: 'Demo Request',
                        path: '/common/demo-request',
                        element: <DemoRequestCommon />,
                        // isSideBar: true
                    },
                ],
                isSideBar: true,
            },
            {
                key: '10',
                icon: <UserOutlined {...icon} />,
                name: 'Grants',
                path: '/grants',
                element: <Grant />,
                children: [],
                access: [userRoles.IT_SUPPORT, userRoles.CONTENT_DEPARTMENT],
                isSideBar: true,
            },
            {
                key: '11',
                icon: <UserOutlined {...icon} />,
                name: 'Contract Awards',
                path: '/contract-awards',
                element: <ContractAward />,
                children: [],
                access: [userRoles.IT_SUPPORT, userRoles.CONTENT_DEPARTMENT],
                isSideBar: true,
            },
            {
                key: '12',
                icon: <UserOutlined {...icon} />,
                name: 'Projects',
                path: '/projects',
                element: <Project />,
                children: [],
                access: [userRoles.IT_SUPPORT, userRoles.CONTENT_DEPARTMENT],
                isSideBar: true,
            },
            {
                key: '13',
                icon: <UserOutlined {...icon} />,
                name: 'Tenders',
                path: '/tenders',
                element: <Tender />,
                children: [],
                access: [userRoles.IT_SUPPORT, userRoles.CONTENT_DEPARTMENT],
                isSideBar: true,
            },
            {
                key: '14',
                icon: <UserOutlined {...icon} />,
                name: 'Customers',
                path: '/customers',
                element: <Customer />,
                children: [
                    {
                        key: '141',
                        icon: <UserOutlined {...icon} />,
                        name: 'Activation Panel',
                        path: '/customers/activation-panel',
                        element: <ActivationPanel />,
                        children: [],
                        isSideBar: false,
                    },
                ],
                isChildHide: true,
                access: [userRoles.SALES],
                isSideBar: true,
            },
            {
                key: '15',
                icon: <UserOutlined {...icon} />,
                name: 'Subscription',
                path: '/subscription',
                element: <Subscription />,
                children: [],
                isSideBar: true,
            },
            {
                key: '16',
                icon: <UserOutlined {...icon} />,
                name: 'Customer Reports',
                path: '/customer-reports',
                element: <CustomerReports />,
                children: [],
                isSideBar: true,
            },
            {
                key: '17',
                icon: <UserOutlined {...icon} />,
                name: 'Daily Reports',
                path: '/daily-reports',
                element: <DailyReports />,
                children: [],
                isSideBar: true,
            },
        ],
        isSideBar: true,
    },
    {
        title: 'auth pages',
        layout: 'auth',
        pages: [
            {
                icon: <ArrowRightOutlined {...icon} />,
                name: 'sign in',
                path: '/sign-in',
                element: <SignIn />,
            },
        ],
    },
];

export default routes;
