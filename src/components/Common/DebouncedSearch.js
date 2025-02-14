import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

const DebouncedSearch = ({ onSearch, placeholder = 'Search...' }) => {
    const handleSearch = (val) => {
        let keywords = val.toLowerCase();
        onSearch(keywords);
    };

    const processChange = debounce((e) => handleSearch(e));

    return (
        <Input
            prefix={<SearchOutlined />}
            placeholder={placeholder}
            onChange={(e) => processChange(e.target.value)}
            style={{ width: 250 }}
            allowClear
            size="small"
        />
    );
};

export default DebouncedSearch;
