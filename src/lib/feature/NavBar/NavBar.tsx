import { NavBarOptions } from "./NavBarOptions";

export const NavBar = ({ title }: { title: string }) => {
  return (
    <div className="flex  items-center justify-between px-[32px] md:px-[62px] h-[72px] border-border sticky z-10 top-0 w-full">
      <p className="text-2xl font-semibold ">{title}</p>
      <NavBarOptions />
    </div>
  );
};

export default NavBar;
