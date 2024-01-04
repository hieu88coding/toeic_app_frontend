import * as React from "react";
import { useState, useEffect, useRef, forwardRef, createRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./examSheet.scss";
import { Anchor, Card } from "antd";
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Scrollbar from "react-perfect-scrollbar";

const ExamSheet = (props) => {
    const array = [];
    const partName = useLocation().pathname.split("/")[3];
    const items =
        [
            {
                key: 'Part 1',
                href: '#image_1.png',
                title: 'Part 1',
            },
            {
                key: 'Part 2',
                href: '#image_4.png',
                title: 'Part 2',
            },
            {
                key: 'Part 3',
                href: '#image_5.png',
                title: 'Part 3',
            },
            {
                key: 'Part 4',
                href: '#image_9.png',
                title: 'Part 4',
            },
            {
                key: 'Part 5',
                href: '#image_13.png',
                title: 'Part 5',
            },
            {
                key: 'Part 6',
                href: '#image_16.png',
                title: 'Part 6',
            },
            {
                key: 'Part 7',
                href: '#image_20.png',
                title: 'Part 7',
            },
        ]
    if (props.typeSheet === "exam") {
        switch (partName) {
            case "1":
                array.push(items[0]);
                break;
            case "2":
                array.push(items[1])
                break;
            case "3":
                array.push(items[2])
                break;
            case "4":
                array.push(items[3])
                break;
            case "5":
                array.push(items[4])
                break;
            case "6":
                array.push(items[5])
                break;
            case "7":
                array.push(items[6])
                break;
            default:
                for (let i = 0; i <= 6; i++) {
                    array.push(items[i]);
                }
                break;
        }
    }

    const handleAnchorClick = (e, link) => {
        e.stopPropagation();
    };

    return (
        <div>
            <div className="examSheetContainer" style={props.typeSheet === "exam" ? {} : { marginTop: 40 }}>
                {props.typeSheet === "exam" &&
                    <div className="anchor">
                        <Anchor
                            onClick={handleAnchorClick}
                            affix={false}
                            direction="horizontal"
                            items={array}
                        />
                    </div>
                }



                <Card title={null}>
                    <Scrollbar options={{
                        suppressScrollX: true
                    }} style={{ maxHeight: 560 }}>
                        <div id="scrollContent">
                            {props.data && props.data.map((image) => (
                                <img id={image.name} style={{ width: '50%', height: 'auto' }} key={image.name} src={image.url} alt={image.name} />
                            ))}
                        </div>
                    </Scrollbar>
                </Card>



            </div>
        </div>
    );
};

export default ExamSheet; 