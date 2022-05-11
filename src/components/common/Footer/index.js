import SimpleReactFooter from "simple-react-footer";
import i18n from "translation/i18n";
import { getCurrentLanguage } from "translation/util";
import "./style.scss";

const Footer = () => {
  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  const columns = [
    {
      title: "Resources",
      resources: [
        {
          name: "About",
          link: "/about",
        },
        {
          name: "Careers",
          link: "/careers",
        },
        {
          name: "Contact",
          link: "/contact",
        },
        {
          name: "Admin",
          link: "/admin",
        },
      ],
    },
    {
      title: "Legal",
      resources: [
        {
          name: "Privacy",
          link: "/privacy",
        },
        {
          name: "Terms",
          link: "/terms",
        },
      ],
    },
    {
      title: "Language",
      resources: [
        {
          name: (
            <div className="d-flex align-items-center">
              <select onChange={changeLanguage} onClick={() => null}>
                <option value="vi">Vietnamese</option>
                <option value="en">English</option>
              </select>
            </div>
          ),
          // link: "",
        },
      ],
    },
  ];

  return (
    <>
      <SimpleReactFooter
        //   description={description}
        //   title={title}
        columns={columns}
        //   linkedin="fluffy_cat_on_linkedin"
        //   facebook="fluffy_cat_on_fb"
        //   twitter="fluffy_cat_on_twitter"
        //   instagram="fluffy_cat_live"
        //   youtube="UCFt6TSF464J8K82xeA?"
        pinterest="fluffy_cats_collections"
        copyright="darkgrey"
        iconColor="darkgrey"
        backgroundColor="transparent"
        fontColor="darkgrey"
        copyrightColor="darkgrey"
      />
    </>
  );
};

export default Footer;
