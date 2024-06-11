"use client";
import { useState } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import CsvImportSCR from "@/app/dashboard/src/csv_import_src";
import { postLists } from "@/app/lib/repo/lists_repo";
import { beforePost, dataToast } from "@/app/utils/custom_helpers";


const ListsImport = (topicId) => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [columnArray, setColumn] = useState([]);
    const [values, setValues] = useState([]);
    const [valuesEmpty, setValuesEmpty] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [topics, setTopics] = useState([]);
    const [csv, setCSV] = useState("");
    const [importTitle, setOnInput] = useState('');


    const handleImport = async (e) => {
        e.preventDefault();

        // Check criteria
        const title = data[0].title;
        const slug = data[0].slug;
        const description = data[0].description;
        const metaDescription = data[0].metaDescription;
        const metaTitle = data[0].metaTitle;
        const body = data[0].body;
        const rankingScore = data[0].rankingScore;

        const requiredFields = { title, slug, description, metaDescription, metaTitle, rankingScore, body };
        const errors = beforePost(requiredFields);

        //check before post
        if (errors !== true) {
            return errors
        }


        if (!data) return;
        setUploading(true);

        let topics = new Array();

        data.map(async (t, i) => {

            const topicsD = {
                title: t.title,
                description: t.description,
                topicId: topicId.topicId,
                slug: t.title,
                rankingScore: t.rankingScore,
            };

            if (topicsD.title && topicsD.description) {
                topics.push(topicsD);
            }

            setTimeout(() => {
                setProgress(i - 1);
            }, i * 10);
        });

        if (!Array.isArray(topics)) {
            toast.error("List must be an array");
            return;
        }

        if (topics.length === 0) {
            toast.error("No list to insert");
            return;
        }

        const { success, msg, dataBody } = await postLists(topics, 'yes', true, importTitle);

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
            compulsory="title|string, description|string, slug|string"
            importType="Lists"
            onInput={setOnInput}
        />

    );
};

export default ListsImport;
