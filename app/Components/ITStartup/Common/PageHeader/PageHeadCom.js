"use client"
import React from "react"
import Link from "next/link"
import Image from "next/image"

const PageHeadCom = ({
  pageTitle,
  breadcrumbTextOne,
  breadcrumbTextTwo,
  breadcrumbUrl
}) => {
  return (
    <>
      <div className="page-title-area page-title-bg2">
        <div className="d-table">
          <div className="d-table-cell">
            <div className="container">
              <div className="page-title-content">
                <h2>{pageTitle}</h2>
                <ul>
                  <li>
                    <Link href={breadcrumbUrl}>{breadcrumbTextOne}</Link>
                  </li>
                  <li>{breadcrumbTextTwo}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Animation Shape Image */}
        <div className="shape-img2">
          <Image
            src="/images/shape/shape2.svg"
            alt="image"
            width={20}
            height={20}
            loading="lazy"
          />
        </div>
        <div className="shape-img3">
          <Image
            src="/images/shape/shape3.svg"
            alt="image"
            width={22}
            height={22}
            loading="lazy"
          />
        </div>
        <div className="shape-img4">
          <Image
            src="/images/shape/shape4.png"
            alt="image"
            width={15}
            height={15}
            loading="lazy"
          />
        </div>
        <div className="shape-img5">
          <Image
            src="/images/shape/shape5.png"
            alt="image"
            width={18}
            height={18}
            loading="lazy"
          />
        </div>
        <div className="shape-img7">
          <Image
            src="/images/shape/shape7.png"
            alt="image"
            width={100}
            height={93}
            loading="lazy"
          />
        </div>
        <div className="shape-img8">
          <Image
            src="/images/shape/shape8.png"
            alt="image"
            width={74}
            height={64}
            loading="lazy"
          />
        </div>
        <div className="shape-img9">
          <Image
            src="/images/shape/shape9.png"
            alt="image"
            width={43}
            height={46}
            loading="lazy"
          />
        </div>
        <div className="shape-img10">
          <Image
            src="/images/shape/shape10.png"
            alt="image"
            width={12}
            height={11}
            loading="lazy"
          />
        </div>
      </div>
    </>
  )
}

export default PageHeadCom
