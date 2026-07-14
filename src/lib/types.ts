export type MenuItem = {
  title: string;
  ruleId: string;
  shortName: string;
  icon: React.ElementType;
  subMenu?: SubmenuItem[];
};

export type SubmenuItem =
  | {
      title: string;
      href: string;
      ruleId: string;
      subMenu?: never;
    }
  | {
      title: string;
      href?: never;
      ruleId?: never;
      subMenu: SubmenuItem[];
    };
