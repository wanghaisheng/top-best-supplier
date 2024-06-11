"use client";
import { useState } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import CsvImportSCR from "@/app/dashboard/src/csv_import_src";
import { beforePost, dataToast } from "@/app/utils/custom_helpers";
import { postQandAs } from "@/app/lib/repo/qanda_repo";

const StepsImport = ({ qanda }) => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [columnArray, setColumn] = useState([]);
    const [values, setValues] = useState([]);
    const [valuesEmpty, setValuesEmpty] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [topics, setTopics] = useState([]);
    const [csv, setCSV] = useState("");

    const handleImport = async (e) => {
        e.preventDefault();

        // Check criteria
        const title = data[0].title;
        const position = data[0].position;
        const body = data[0].body;

        const requiredFields = { title, position, body };
        const errors = beforePost(requiredFields);

        //check before post
        if (errors !== true) {
            return errors
        }


        if (!data) return;
        setUploading(true);

        let topics = new Array();

        data.map(async (t, i) => {

            topics.push({ step: t.title, position: t.position, dataBody: t.body, slug: t.title });

            setTimeout(() => {
                setProgress(i - 1);
            }, i * 10);
        });

        if (!Array.isArray(topics)) {
            toast.error("Steps must be an array");
            return;
        }

        if (topics.length === 0) {
            toast.error("No steps to insert");
            return;
        }

        let updateData = {};

        updateData.steps = topics;

        updateData._id = qanda._id;

        updateData.slug = qanda.slug;


        const { success, msg, dataBody } = await postQandAs([updateData], 'no', true);

        if (success) {
            // Set progress
            setProgress(values.length - 1);
            setCSV(dataBody);
            setValuesEmpty(true);
            setUploading(false);
        }

        dataToast(success, msg);
    };

    const handleFileChange = (e) => {
        e.preventDefault();

        console.log("file change");
        setData([]);
        setColumn([]);
        setValues([]);

        Papa.parse(e.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (result) {
                const columnArray = [];
                const valuesArray = [];

                result.data.map((d) => {
                    columnArray.push(Object.keys(d));
                    valuesArray.push(Object.values(d));
                });

                setData(result.data);
                setColumn(columnArray[0]);
                setValues(valuesArray);

                if (valuesArray.length > 0) {
                    setValuesEmpty(false);
                }
            },
        });
    };

    return (
        <CsvImportSCR
            handleFileChange={handleFileChange}
            values={values}
            handleImport={handleImport}
            csv={csv}
            progress={progress}
            columnArray={columnArray}
        />
    );
};

export default StepsImport;
