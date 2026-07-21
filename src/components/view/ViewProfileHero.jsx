import GenderIcon from "../GenderIcon";

import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";

/**
 * ViewProfileHero
 *
 * The avatar + name + gender icon + subtitle + badge block shown at the
 * top of every view drawer.
 *
 * @prop {object}          record      - the data object (lead / client / user)
 * @prop {string}          subtitle    - line shown below the name (e.g. "Company · Industry")
 * @prop {React.ReactNode} badge       - status badge / status select rendered below subtitle
 *
 */
export default function ViewProfileHero({ record, subtitle, badge }) {
  const profileSrc = getProfileImage(record);

  return (
    <div className="flex items-center gap-4">
      <img
        src={profileSrc}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shrink-0"
      />
      <div>
        <div className="flex items-center gap-1.5">
          <h2 className="text-lg font-semibold text-gray-800 leading-tight">
            {getDisplayName(record, {
              includeMiddleInitial: true,
              includeSuffix: true,
            })}
          </h2>
          <GenderIcon gender={record?.sex} />
        </div>

        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}

        {badge && <div>{badge}</div>}
      </div>
    </div>
  );
}
