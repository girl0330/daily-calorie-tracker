import {NavLink} from "react-router-dom";

export default function Nav() {
    return (
        <>
            <aside className="w-60 shrink-0 p-5 ">
                <div className="h-20 flex items-center justify-center text-3xl font-bold text-(--primary-1)">Daily Tracker</div>

                <div className='border my-4' />

                <nav className="flex flex-col gap-2">
                    <p className="mb-2 text-sm font-semibold text-(--text-muted)">MENU</p>

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `rounded-md px-4 py-3 text-xl font-medium transition-colors ${
                                isActive
                                    ? "bg-(--primary-5) text-(--primary-1)"
                                    : "text-(--text-primary) hover:bg-(--primary-5)"  
                            }`
                        }
                    >
                        Daily Tracker
                    </NavLink>
                    <NavLink
                        to="/monthly"
                        className={({ isActive }) =>
                            `rounded-md px-4 py-3 text-xl font-medium transition-colors ${
                                isActive
                                    ? "bg-(--primary-5) text-(--primary-1)"
                                    : "text-(--text-primary) hover:bg-(--primary-5)"
                            }`
                        }
                    >
                        Monthly Tracker
                    </NavLink>

                    {/*<NavLink*/}
                    {/*    to="/monthly"*/}
                    {/*    className="rounded-md px-4 py-3 text-xl font-medium text-(--text-primary) hover:bg-(--primary-5) transition-colors"*/}
                    {/*>*/}
                    {/*    Monthly Tracker*/}
                    {/*</NavLink>*/}
                </nav>
            </aside>
        </>
    )
}

