import { useState } from "react";
import TinyMCEEditor from "@/app/utils/tinymce";
import CustomButton from "@/app/components/widgets/button";
import { updateTemplate } from "@/app/lib/repo/templates_repo";
import { TempModel } from "@/app/models/templates_model";
import { toast } from "sonner";
import { updateQandA } from "@/app/lib/repo/qanda_repo";
import { QandAModel } from "@/app/models/qanda_model";
import { BodyList } from "@/app/components/body_lists";

export default function Steps({ data }) {
  let [bodies, setBodies] = useState(data.steps ? JSON.parse(data.steps) : []);

  if (!data.steps) {
    return <div>no step found</div>;
  }

  function addNewBody() {
    const newBody = {
      dataBody: "",
      position: "0",
    };

    setBodies((prevBodies) => [...prevBodies, newBody]);
  }

  async function submitForm() {
    const updateData: QandAModel = {};

    updateData.steps = bodies;
    updateData._id = data._id;
    const res = await updateQandA(updateData);

    if (res.data === true) {
      toast.success("template updated");
    } else {
      toast.error("error updating template");
    }
  }

  return (
    <>
      <BodyList bodies={bodies} setBodies={setBodies} />

      <div className="flex justify-end mt-10">
        <div className="py-10 px-10">
          <CustomButton color="green" type={"submit"} onClick={addNewBody}>
            Add
          </CustomButton>
        </div>
        <div className="py-10 px-10">
          <CustomButton color="green" type={"submit"} onClick={submitForm}>
            Publish
          </CustomButton>
        </div>
      </div>
    </>
  );
}
