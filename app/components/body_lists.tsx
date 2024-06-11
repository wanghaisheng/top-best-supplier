import TinyMCEEditor from "@/app/utils/tinymce";

export const BodyList = ({ bodies, setBodies }) => (
  <div className="mt-5">
    {bodies.map((body, index) => (
      <div key={index}>
        {index === 1 && <div className="py-5 font-bold">Others</div>}
        <div className="flex flex-col md:flex-row mt-4">
          <div className="w-full lg:w-11/12">
            <TinyMCEEditor
              height="300"
              onChange={(e) => {
                const updatedBodies = [...bodies];
                updatedBodies[index].dataBody = e;
                setBodies(updatedBodies);
              }}
              initialValue={body.dataBody}
            />
          </div>

          <div className="flex items-center justify-end right-0 mx-3 my-4">
            <div className="flex flex-col">
              <div>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    {"position: "}
                  </span>
                  <input
                    onChange={(e) => {
                      const updatedBodies = [...bodies];
                      updatedBodies[index].position = e.target.value;
                      setBodies(updatedBodies);
                    }}
                    type="number"
                    name="position"
                    id="position"
                    autoComplete="position"
                    defaultValue={body.position}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="eg. 1"
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={(e) => {
                    let updatedBodies = [...bodies];
                    updatedBodies = bodies.filter((_, i) => i !== index);

                    setBodies(updatedBodies);
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
