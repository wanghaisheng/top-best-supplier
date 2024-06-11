import { CONTACT_US } from "@/constants";
import React from "react";

export default function Footer() {
  return (
    <footer className="relative bottom-0 w-full z-50">
      <div className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-12 flex flex-wrap justify-between text-sm lg:text-md">
          <div>
            <div className="font-bold">Links</div>
            <ul>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Help</a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold">More Links</div>
            <ul>
              <li>
                <a href="#">Terms</a>
              </li>
              <li>
                <a href="#">Privacy</a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold">Social</div>
            <ul>
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">LinkedIn</a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold">Company</div>
            <ul>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href={CONTACT_US}>Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
