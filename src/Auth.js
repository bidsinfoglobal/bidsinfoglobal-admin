import React from 'react';
import { Route, Routes } from 'react-router-dom';
import routes from './routes';

export default function Auth() {
    return (
        <div>
            <Routes>
                {routes.map(
                    ({ layout, pages }) =>
                        layout === 'auth' &&
                        pages.map(({ path, element }) => (
                            <Route exact path={path} element={element} />
                        )),
                )}
            </Routes>
        </div>
    );
}
