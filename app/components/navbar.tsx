"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import SearchScreen from "./search_screen";
import Image from "next/image";
import { CONTACT_US } from "@/constants";
import { usePathname } from "next/navigation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar = () => {
  const pathname = usePathname();
  const currentUrl = pathname;

  const navigation = [
    { name: "Home", href: "/", current: false },
    { name: "About Us", href: "/#", current: false },
    {
      name: "Contact Us",
      href: CONTACT_US,
      current: false,
    },
    { name: "Policy", href: "/#", current: false },
    { name: "Login", href: "/auth/login", current: false },
  ];

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10; // Change this value to adjust the scroll threshold
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Disclosure
      as="nav"
      className={`bg-gray-200 fixed w-full z-10 shadow lg:shadow-none transition-all duration-300 ${
        scrolled ? "bg-gray-200 shadow lg:shadow-none" : "bg-transparent"
      }`}
    >
      {({ open }) => (
        <>
          <div className="mx-auto">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex ml-10 flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link prefetch={true} href="/">
                    <Image
                      className="h-8 w-auto"
                      src="/images/logo.png"
                      alt="Toping Now"
                      width={200}
                      height={50}
                      priority
                      placeholder="blur"
                      blurDataURL={"/images/logo.png"}
                    />
                  </Link>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start lg:justify-end">
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4 ">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        as={item.href}
                        className={classNames(
                          currentUrl == item.href
                            ? "bg-gray-900 text-white"
                            : "text-gray-800 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={
                          currentUrl == item.href ? "page" : undefined
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-0 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative z-10 flex rounded-full px-2 sm:px-6 lg:px-2 py-2 sm:py-6 lg:py-2 bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-grey-200">
                      <span className="absolute -inset-1.5" />
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Search</span>
                      <MagnifyingGlassIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-300"
                    enterFrom="translate-x-full opacity-0"
                    enterTo="translate-x-0 opacity-100"
                    leave="transition ease-in duration-200"
                    leaveFrom="translate-x-0 opacity-100"
                    leaveTo="translate-x-full opacity-0"
                  >
                    <Menu.Items className="absolute right-0 mr-0 pr-0 z-10 h-screen mt-2 w-48 lg:w-80 origin-top-right bg-gray-200">
                      <br />
                      <SearchScreen />
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    currentUrl == item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-800 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={currentUrl == item.href ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
