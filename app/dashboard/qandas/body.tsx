import { useState } from "react";
import TinyMCEEditor from "@/app/utils/tinymce";
import CustomButton from "@/app/components/widgets/button";
import { updateTemplate } from "@/app/lib/repo/templates_repo";
import { TempModel } from "@/app/models/templates_model";
import { toast } from "sonner";
import { updateQandA } from "@/app/lib/repo/qanda_repo";
import { BodyList } from "@/app/components/body_lists";

export default function QandAsBody({ data }) {
  let [bodies, setBodies] = useState(data.body ? JSON.parse(data.body) : []);

  if (!data.body) {
    return <div>no QandA found</div>;
  }

  function addNewBody() {
    const newBody = {
      dataBody: "",
      position: "0",
    };

    setBodies((prevBodies) => [...prevBodies, newBody]);
  }

  async function submitForm() {
    const updateData: TempModel = {};

    updateData.body = bodies;
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
