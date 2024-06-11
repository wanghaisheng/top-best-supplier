"use client";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import CsvImportSCR from "@/app/dashboard/src/csv_import_src";
import { beforePost, dataToast } from "@/app/utils/custom_helpers";
import { postTopics } from "@/app/roadmap/topics_roadmap";


const TopicsImport = (top_id) => {
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

    const requiredFields = { title, slug, description, metaDescription, metaTitle, body };
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
        topId: top_id.top_id,
        slug: t.title,
      };

      if (topicsD.title && topicsD.description) {
        topics.push(topicsD);
      }

      setTimeout(() => {
        setProgress(i - 1);
      }, i * 10);
    });

    if (!Array.isArray(topics)) {
      toast.error("Topics must be array");
      return;
    }

    if (topics.length === 0) {
      toast.error("No topics to insert");
      return;
    }

    const { success, msg, dataBody } = await postTopics(topics, 'yes', true, importTitle);

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
      compulsory="title|string, description|string, slug|string"
      importType="Topics"
      onInput={setOnInput}
    />
  );
};

export default TopicsImport;
