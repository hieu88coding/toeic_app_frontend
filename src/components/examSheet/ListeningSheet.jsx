import * as React from "react";
import { useState, useEffect, useRef, forwardRef, createRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./ListeningSheet.scss";
import { Anchor, Card, Button } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
import Scrollbar from "react-perfect-scrollbar";
import axios from "axios";

import { Table } from "antd";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { storage } from '../../firebase';
import { Part1 } from "../examParts/part1";
import { Part2 } from "../examParts/Part2";
import { Part3 } from "../examParts/Part3";
import { Part4 } from "../examParts/Part4";

const ListeningSheet = (props) => {
    const data = props.data;
    console.log(data);
    const partName = useLocation().pathname.split("/")[3];

    return (
        <div>
            <div className="listeningSheetContainer" style={props.typeSheet === "exam" ? {} : { marginTop: 40 }}>

                <Card title={null}>
                    <Scrollbar options={{
                        suppressScrollX: true
                    }} style={{ maxHeight: 560 }}>
                        <div id="scrollContent">
                            {data.length !== 0 && partName === 'part1' && <Part1 audio={data.audio} images={data.images} />}
                            {data.length !== 0 && partName === 'part2' && <Part2 isPart={true} audio={data.audio} />}
                            {data.length !== 0 && partName === 'part3' && <Part3 isPart={true} audio={data.audio} images={data.images} exel={data.exel[0]} />}
                            {data.length !== 0 && partName === 'part4' && <Part4 isPart={true} audio={data.audio} images={data.images} exel={data.exel[0]} />}
                        </div>
                    </Scrollbar>
                </Card>


            </div>
        </div>
    );
};

export default ListeningSheet; 