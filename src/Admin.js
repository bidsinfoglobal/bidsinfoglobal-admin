import React, { useEffect, useState } from 'react';
import routes from './routes';
import {
    Link,
    Route,
    Routes,
    useLocation,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';

import {
    DownOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Dropdown, Layout, Menu, theme } from 'antd';
import PageNotFound from './PageNotFound';
import { useCookies } from 'react-cookie';
import { userRoles } from './utils/roles';

const { Header, Sider, Content } = Layout;

export default function Admin() {
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();
    const location = useLocation();

    const [breadcrumb, setBreadcrumb] = useState([
        ...generateBreadCrumb(location.pathname),
    ]);
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'role']);
    // const [role_cookie] = useCookies(['role']);

    const [defaultPath, setDefaultPath] = useState(1);
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const dropdown_items = [
        {
            key: '1',
            label: 'Profile',
            onClick: () => navigate('/profile'),
        },
        {
            key: '2',
            label: 'Sign Out',
            onClick: () => {
                removeCookie('token');
                navigate('/auth/sign-in');
            },
        },
    ];

    /**
     * this function is used to generate object for breadcrumb
     * @param {string} pathname route path url
     * @returns {Object}
     */
    function generateBreadCrumb(pathname) {
        if (pathname.match('/cms/')) {
            pathname = pathname.replace('/cms/', '/');
        }
        if (pathname.match('/common/')) {
            pathname = pathname.replace('/common/', '/');
        }
        if (pathname.match('/master/')) {
            pathname = pathname.replace('/master/', '/');
        }

        pathname = pathname.replace('-', ' ');
        var paths = pathname.split('/');

        // remove the last element if there was a / at the end of the pathname
        paths = paths[paths.length - 1] === '' ? paths.slice(0, paths.length - 1) : paths;

        // remove the first element if the second one is an empty string which means that we are in the root of the website
        paths = paths[1] === '' ? paths.slice(1) : paths;

        return paths.map((path, index) => {
            // Add the > symbol only between two links
            // var arrow = index !== paths.length-1 ? " > " : " ";

            // The first element should receive the <IndexLink> React element
            if (index === 0) {
                return {
                    title: (
                        <Link key={index} to="/" activeclassname="active" className="">
                            Dashboard
                        </Link>
                    ),
                };
            }

            // Build the path for the current URL
            var url = paths.slice(0, index + 1).join('/');
            // HTML structure for every link except the first
            if (paths.length == index + 1) {
                return {
                    title: (
                        <span className="capitalize">
                            {searchParams.get('id') && path === 'add' ? 'edit' : path}
                        </span>
                    ),
                };
            } else
                return {
                    title: (
                        <Link key={index} to={url} className="capitalize">
                            {path}
                        </Link>
                    ),
                };
        });
    }

    function setRouteKey() {
        var path = location.pathname;
        var _routes = routes.find((r) => r.layout == 'admin')?.pages || [];

        for (const _route of _routes) {
            if (!_route.isSideBar) continue;
            if (
                !_route.isChildHide &&
                Array.isArray(_route.children) &&
                _route.children.length > 0
            ) {
                for (const sub_route of _route.children) {
                    if (sub_route.path == path) {
                        setDefaultPath(sub_route.key);
                        break;
                    }
                }
            } else {
                if (_route.path == path) {
                    setDefaultPath(_route.key);
                    break;
                }
            }
        }
    }

    useEffect(() => {}, []);

    useEffect(() => {
        setBreadcrumb([...generateBreadCrumb(location.pathname)]);
        setRouteKey();
    }, [location.pathname]);

    return (
        <div>
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
                    <div className="logo w-12 h-12" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[`1`]}
                        // activeKey={`${defaultPath}`}
                        selectedKeys={[`${defaultPath}`]}
                        items={
                            routes.map(
                                ({ layout, pages, children }) =>
                                    layout === 'admin' &&
                                    pages
                                        .filter(
                                            ({ isSideBar, access }) =>
                                                isSideBar &&
                                                (cookies.role === userRoles.SUPER_ADMIN
                                                    ? true
                                                    : Array.isArray(access)
                                                      ? access.includes(cookies.role)
                                                      : false),
                                        )
                                        .map(
                                            ({
                                                key,
                                                name,
                                                icon,
                                                path,
                                                children: chldrn,
                                                showChildren,
                                            }) => ({
                                                key,
                                                icon,
                                                label: name,
                                                onClick: () =>
                                                    !showChildren && navigate(path),
                                                children:
                                                    !Array.isArray(chldrn) ||
                                                    chldrn.length == 0 ||
                                                    !showChildren
                                                        ? null
                                                        : chldrn.map((ch) => ({
                                                              key: ch.key,
                                                              icon: ch.icon,
                                                              label: ch.name,
                                                              onClick: () =>
                                                                  navigate(ch.path),
                                                          })),
                                            }),
                                        ),
                            )[0]
                        }
                    />
                </Sider>
                <Layout className="site-layout">
                    <Header style={{ padding: 0, background: colorBgContainer }}>
                        <div className="flex items-center justify-between mx-4">
                            <div className="flex items-center justify-start gap-4">
                                {React.createElement(
                                    collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                                    {
                                        className: 'trigger text-xl',
                                        onClick: () => setCollapsed(!collapsed),
                                    },
                                )}
                                <div>
                                    <span className="text-lg font-semibold select-none">
                                        Bids Info Global Panel
                                    </span>
                                </div>
                            </div>
                            <div>
                                <Dropdown
                                    menu={{
                                        items: dropdown_items,
                                        // selectable: true,
                                        // defaultSelectedKeys: ['3'],
                                    }}
                                >
                                    <Button
                                        icon={<UserOutlined />}
                                        className="rounded-full p-1"
                                    ></Button>
                                </Dropdown>
                            </div>
                        </div>
                    </Header>

                    <Content
                        style={{
                            margin: '20px 16px',
                            padding: 24,
                            minHeight: '85vh',
                            background: colorBgContainer,
                            overflowY: 'auto',
                        }}
                    >
                        <div className="-mt-2 mb-3">
                            <Breadcrumb items={breadcrumb} />
                        </div>
                        <Routes>
                            {routes.map(
                                ({ layout, pages }) =>
                                    layout === 'admin' &&
                                    pages
                                        .filter(({ access }) =>
                                            cookies.role === userRoles.SUPER_ADMIN
                                                ? true
                                                : Array.isArray(access)
                                                  ? access.includes(cookies.role)
                                                  : false,
                                        )
                                        .map(({ path, element, children }) => (
                                            <>
                                                <Route
                                                    exact
                                                    path={path}
                                                    element={element}
                                                />
                                                {Array.isArray(children) &&
                                                    children.map((ch) => (
                                                        <Route
                                                            exact
                                                            path={ch.path}
                                                            element={ch.element}
                                                        />
                                                    ))}
                                            </>
                                        )),
                            )}
                            {/* <Route exact path={'/profile'} element={<Profile />} /> */}
                            <Route exact path={'*'} element={<PageNotFound />} />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}
