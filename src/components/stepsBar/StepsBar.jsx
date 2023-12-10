import * as React from "react";
import "./stepsBar.scss";
import { Card, Steps, Popover } from "antd";

const customDot = (dot, { status, index }) => (
    <Popover
        content={
            <span>
                step {index} status: {status}
            </span>
        }
    >
        {dot}
    </Popover>
);
const description = 'You can hover on the dot.';

const items = [
    {
        title: '400',
        style: {
            maxWidth: 75,
        }
    },
    {
        title: '450',
        style: {
            maxWidth: 75,
        }
    },
    {
        title: '500',
        style: {
            maxWidth: 75,
        }
    },
    {
        title: '550',
        style: {
            maxWidth: 75,
        }
    },
    {
        title: '600',
        style: {
            maxWidth: 75,
        }
    },
    {
        title: '650',
        style: {
            maxWidth: 75,
        }
    },
    {
        title: '700',
        style: {
            maxWidth: 75,
        }
    },
    {
        title: '750',
        style: {
            maxWidth: 75,
        }
    },
    {
        title: '800',
        style: {
            maxWidth: 75,
        }
    },
    {
        title: '850',
        style: {
            maxWidth: 75,
        }
    },
    {
        title: '900',
        style: {
            maxWidth: 75,
        }
    },
    {
        title: '950',
        style: {
            maxWidth: 75,
        }
    },
    {
        title: '990',
        style: {
            maxWidth: 75,
        }
    },
];

const StepsBar = () => {
    return (
        <div className="stepsBarContainer">
            <Card title="Lộ trình hiện tại" style={{ width: "100%" }}>
                <p style={{ paddingBottom: 20 }}>Bạn đang làm rất tốt, cố gắng hoàn thành bài tập chúng tôi đề xuất nhé</p>
                <Steps current={2} progressDot={customDot} items={items} />
            </Card>
        </div>
    );
};

export default StepsBar;