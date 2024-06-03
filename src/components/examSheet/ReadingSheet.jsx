import * as React from "react";
import { useState, useEffect, useRef, forwardRef, createRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./readingSheet.scss";
import { Anchor, Card, Button } from "antd";
import Scrollbar from "react-perfect-scrollbar";
import { Part5 } from "../examParts/Part5";
import { Part6 } from "../examParts/Part6";
import { Part7Custom } from "../examParts/Part7Custom";
const ReadingSheet = (props) => {
    const data = props.data;
    console.log(data);
    const partName = useLocation().pathname.split("/")[3];

    return (
        <div>
            <div className="readingSheetContainer" style={props.typeSheet === "exam" ? {} : { marginTop: 40 }}>

                <Card title={null}>
                    <Scrollbar options={{
                        suppressScrollX: true
                    }} style={{ maxHeight: 560 }}>
                        <div id="scrollContent">
                            {data.length !== 0 && partName === 'part5' && <Part5 exel={data.exel[0]} />}
                            {data.length !== 0 && partName === 'part6' && <Part6 exel={data.exel[0]} />}
                            {data.length !== 0 && partName === 'part71' && <Part7Custom partSelector={partName} exel={data.exel[0]} />}
                            {data.length !== 0 && partName === 'part72' && <Part7Custom partSelector={partName} exel={data.exel[0]} />}
                            {data.length !== 0 && partName === 'part73' && <Part7Custom partSelector={partName} exel={data.exel[0]} />}
                        </div>
                    </Scrollbar>
                </Card>


            </div>
        </div>
    );
};

export default ReadingSheet; 