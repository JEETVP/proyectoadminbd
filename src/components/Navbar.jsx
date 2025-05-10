import React, { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#003366] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500 "
                alt="Workflow"
              />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:bg-[#CC9900] hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Inicio
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:bg-[#CC9900] hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Usuarios
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:bg-[#CC9900] hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Trámites
                </a>
                <a
                  href="/create-appointment"
                  className="bg-[#CC9900] text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Crear Cita
                </a>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-[#003366] inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#CC9900] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#003366] focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Transition
        show={isOpen}
        as={Fragment}
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#"
              className="text-gray-300 hover:bg-[#CC9900] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Inicio
            </a>
            <a
              href="#"
              className="text-gray-300 hover:bg-[#CC9900] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Usuarios
            </a>
            <a
              href="#"
              className="text-gray-300 hover:bg-[#CC9900] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Trámites
            </a>
            <a
              href="/create-appointment"
              className="bg-[#CC9900] text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Crear Cita
            </a>
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;