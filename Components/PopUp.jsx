import React, { useState, useEffect } from "react";

const PopUp = ({ setOpenModel, donate, donateFunction, getDonations }) => {
  const [amount, setAmount] = useState("");
  const [allDonationData, setAllDonationData] = useState([]);

  const createDonation = async () => {
    try {
      const data = await donateFunction(donate.pId, amount);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donationData = await getDonations(donate.pId);
        setAllDonationData(donationData);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };
    fetchDonations();
  }, [donate.pId, getDonations]);

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-4xl font-semibold">{donate.title}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setOpenModel(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  x
                </span>
              </button>
            </div>
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-slate-500 text-lg leading-relaxed">
                {donate.description}
              </p>

              <input
                onChange={(e) => setAmount(e.target.value)}
                placeholder="amount"
                required
                type="text"
                className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                id="amount"
                name="amount"
              />

              {Array.isArray(allDonationData) && allDonationData.map((donate, i) => (
                <p className="my-4 text-slate-500 text-lg leading-relaxed" key={i}>
                  {i + 1}: {donate.donation} {""}
                  {donate.donator.slice(0, 35)}
                </p>
              ))}
            </div>
			<div>
				<button 
				className="text-red-500 font-fold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none mr-1 mb-1"
				type="button"
				onClick={() => setOpenModel(false)}>
					Close
				</button>
				<button 
				className="background text-white active:bg-emerald-600 font-fold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none mr-1 mb-1"
				type="button"
				onClick={() => createDonation()}>
					Donate
				</button>
			</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopUp;
