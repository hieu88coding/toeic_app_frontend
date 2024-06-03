import React, { useState } from 'react';
import './partMenu.scss';
import { Button, Menu, Card } from 'antd';
import { Link, useNavigate, useLocation } from "react-router-dom";
const items = [
    {
        key: 'part1',

        label: 'Part 1 - Mô tả tranh',
    },
    {
        key: 'part2',

        label: 'Part 2 - Hỏi & Đáp',
    },
    {
        key: 'part3',

        label: 'Part 3 - Đoạn hội thoại',
    },
    {
        key: 'part4',
        label: 'Part 4 - Bài nói ngắn',
    },
    {
        key: 'part5',
        label: 'Part 5 - Hoàn thành câu',
    },
    {
        key: 'part6',
        label: 'Part 6 - Hoàn thành đoạn văn',
    },
    {
        key: 'part71',
        label: 'Part 7 - Đoạn đơn',
    },
    {
        key: 'part72',
        label: 'Part 7 - Đoạn kép',
    },
    {
        key: 'part73',
        label: 'Part 7 - Đoạn ba',
    },

];
const PartMenu = (props) => {
    const navigate = useNavigate();
    const onClick = (e) => {
        const parts = e.key.match(/[a-zA-Z]+|[^a-zA-Z]+/g);
        const number = parseInt(parts[1]);
        if (number < 5) {
            navigate(`/listenings/practice/${e.key}`)
        } else {
            navigate(`/readings/practice/${e.key}`)
        }
    };
    return (
        <div
            style={{
                width: 256,
            }}
        >



            <Menu
                defaultSelectedKeys={[`${props.selected}`]}
                style={{ width: '100%', marginTop: 20 }}
                onClick={onClick}
                mode="inline"
                //theme="dark"
                items={items}
            />


        </div>
    );
};
export default PartMenu;