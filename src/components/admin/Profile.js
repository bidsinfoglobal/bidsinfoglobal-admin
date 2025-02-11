import React from 'react';
import ProfileEdit from './models/ProfileEdit';
import { getCookie, parseJwt } from '../../utils/fetch-cookies';

export default function Profile() {
    const userData = parseJwt(getCookie('token'));
    return (
        <div className="h-full overflow-y-auto">
            <main className="">
                {/* <section className=" block h-500-px">
    <div className="  w-full  bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2710&amp;q=80')" }}>
      <span id="blackOverlay" className="w-full   opacity-50 bg-black"></span>
    </div>
    <div className="    w-full  pointer-events-none overflow-hidden h-70-px">
      <svg className=" bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
        <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
      </svg>
    </div>
  </section> */}
                <section className="">
                    <div className="container mx-auto px-4">
                        <div className=" flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded-lg">
                            {/* <ProfileEdit /> */}
                            <div className="px-6">
                                <div className="flex flex-wrap justify-center">
                                    {/* <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
              <div className="">
                <img alt="..." src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg" className="shadow-xl rounded-full h-auto align-middle border-none  -m-16 -ml-20 lg:-ml-16 max-w-150-px" />
              </div>
            </div> */}

                                    <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                                        <div className="py-6 px-3 mt-32 sm:mt-0 float-right">
                                            {/* <button className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button"> */}
                                            {/* </button> */}
                                        </div>
                                    </div>
                                    {/* <div className="w-full lg:w-4/12 px-4 lg:order-1">
              <div className="flex justify-center py-4 lg:pt-4 pt-8">
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">22</span><span className="text-sm text-blueGray-400">Friends</span>
                </div>
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">10</span><span className="text-sm text-blueGray-400">Photos</span>
                </div>
                <div className="lg:mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">89</span><span className="text-sm text-blueGray-400">Comments</span>
                </div>
              </div>
            </div> */}
                                </div>
                                <div className="text-center ">
                                    <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                                        {userData.username.split('_').join(' ')}
                                    </h3>
                                    <div className="mb-2 text-blueGray-600">
                                        <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                                        {userData.role.split('_').join(' ')}
                                    </div>
                                    <div className="mb-2 text-blueGray-600">
                                        <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                                        {userData.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
