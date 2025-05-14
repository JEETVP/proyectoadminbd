// src/components/Navbar.jsx

import React, { useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const checkUserRole = () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUserRole(null);
          return;
        }

        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          setUserRole(null);
          return;
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        setUserRole(payload.rol);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setUserRole(null);
      }
    };

    checkUserRole();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isAdmin = userRole === "admin";

  return (
    <nav className="bg-[#003366] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-12 w-15"
                src="https://pbr.puebla.gob.mx/images/2017/logoGEP.png"
                alt="Workflow"
              />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={handleLogout}
                  className="text-red-300 hover:bg-red-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Cerrar Sesión
                </button>

                <Link
                  to="/usuario"
                  className={`text-gray-300 hover:bg-[#CC9900] hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/usuario") ? "bg-[#CC9900] text-white" : ""
                  }`}
                >
                  Usuario
                </Link>

                <Link
                  to="/tramites"
                  className={`text-gray-300 hover:bg-[#CC9900] hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/tramites") ? "bg-[#CC9900] text-white" : ""
                  }`}
                >
                  Trámites
                </Link>

                <Link
                  to="/create-appointment"
                  className={`text-gray-300 hover:bg-[#CC9900] hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/create-appointment") ? "bg-[#CC9900] text-white" : ""
                  }`}
                >
                  Crear Cita
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    className={`text-gray-300 hover:bg-[#CC9900] hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/admin-dashboard") ? "bg-[#CC9900] text-white" : ""
                    }`}
                  >
                    Administradores
                  </Link>
                )}
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
            <button
              onClick={handleLogout}
              className="text-red-300 hover:bg-red-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Cerrar Sesión
            </button>

            <Link
              to="/usuario"
              className={`text-gray-300 hover:bg-[#CC9900] hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/usuario") ? "bg-[#CC9900] text-white" : ""
              }`}
            >
              Usuario
            </Link>

            <Link
              to="/tramites"
              className={`text-gray-300 hover:bg-[#CC9900] hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/tramites") ? "bg-[#CC9900] text-white" : ""
              }`}
            >
              Trámites
            </Link>

            <Link
              to="/create-appointment"
              className={`text-gray-300 hover:bg-[#CC9900] hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/create-appointment") ? "bg-[#CC9900] text-white" : ""
              }`}
            >
              Crear Cita
            </Link>

            {isAdmin && (
              <Link
                to="/admin-dashboard"
                className={`text-gray-300 hover:bg-[#CC9900] hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/admin-dashboard") ? "bg-[#CC9900] text-white" : ""
                }`}
              >
                Administradores
              </Link>
            )}
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;