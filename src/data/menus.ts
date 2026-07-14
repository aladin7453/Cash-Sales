import { assetModule } from "./modules/asset-management";
import { customerModule } from "./modules/customer";
import { shippingModule } from "./modules/cargo-shipping";
import { classManagementModule } from "./modules/class-management";
import { financeModule } from "./modules/finance";
import { fleetManagementModule } from "./modules/fleet-management";
import { jobManagementModule } from "./modules/job-management";
import { organizationModule } from "./modules/organization";
import { productionModule } from "./modules/production";
import { purchaseModule } from "./modules/purchase";
import { salesModule } from "./modules/sales";
import { serviceModule } from "./modules/service";
import { settingModule } from "./modules/setting";
import { stockModule } from "./modules/stock";
import { promotionModule } from "./modules/promotion";
import { systemAccountModule } from "./modules/system-account";

import type { MenuItem } from "@/lib/types";

export const menus: MenuItem[] = [
  // systemAccountModule,
  // organizationModule,
  // settingModule,
  // financeModule,
  // customerModule,
  salesModule,
  // jobManagementModule,
  // purchaseModule,
  // assetModule,
  // stockModule,
  // serviceModule,
  // promotionModule,
  // productionModule,
  // classManagementModule,
  // fleetManagementModule,
  // shippingModule,
];