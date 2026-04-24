import { motion } from "framer-motion";
import {
	Github,
	Linkedin,
	Mail,
	Phone,
	GraduationCap,
	Twitter,
} from "lucide-react";
import { resolveAsset } from "../lib/useContent.js";

/**
 * BioHero — hero section for the Bio. Full-bleed background, capped interior.
 *
 * Layout:
 *   • Desktop: 60% text / 40% image (grid-cols-[3fr_2fr])
 *   • Mobile:  stacked, image on top, text below (order-first on image)
 *
 * All fields optional; only render the parts that exist in the data.
 */
export default function BioHero({ data }) {
	if (!data || typeof data !== "object") return null;
	const bio = Array.isArray(data) ? data[0] : data;
	if (!bio) return null;

	const {
		name,
		firstName,
		lastName,
		role,
		tagline,
		description,
		location,
		email,
		phone,
		image,
		resume,
		github,
		linkedin,
		scholar,
		twitter,
	} = bio;

	const COURTESY_PREFIXES = /^(md\.?|mr\.?|mrs\.?|ms\.?|dr\.?|prof\.?)$/i;
	function splitName(fullName) {
		return {
			accent: firstName || "First name",
			rest: lastName || "Last name",
		};
	}
	const { accent: nameAccent, rest: nameRest } = splitName(name);

	// Icons are paired at render time. Phone gets its own entry here — no longer
	// shoved into an aside — so it renders with the same visual weight as the
	// other contact links.
	const socials = [
		github && {
			label: "GitHub",
			href: /^https?:\/\//.test(github)
				? github
				: `https://github.com/${github}`,
			Icon: Github,
		},
		linkedin && {
			label: "LinkedIn",
			href: /^https?:\/\//.test(linkedin)
				? linkedin
				: `https://linkedin.com/in/${linkedin}`,
			Icon: Linkedin,
		},
		scholar && { label: "Scholar", href: scholar, Icon: GraduationCap },
		twitter && {
			label: "Twitter",
			href: /^https?:\/\//.test(twitter)
				? twitter
				: `https://twitter.com/${twitter}`,
			Icon: Twitter,
		},
		email && { label: "Email", href: `mailto:${email}`, Icon: Mail },
		phone && {
			label: phone,
			href: `tel:${phone.replace(/[^\d+]/g, "")}`,
			Icon: Phone,
		},
	].filter(Boolean);

	return (
		// Full-bleed wrapper (relative; ambient background lives here)
		<section className="relative w-full overflow-hidden">
			<div
				aria-hidden
				className="absolute inset-0 bg-radial-emerald pointer-events-none"
			/>
			<div
				aria-hidden
				className="
          absolute inset-0 bg-grid-faint pointer-events-none
          [background-size:48px_48px]
          [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]
        "
			/>

			{/* Capped-interior container, 60/40 split on md+ */}
			<div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-6 md:pt-8 pb-10 md:pb-16">
				<div
					className="
            grid gap-10 md:gap-16
            grid-cols-1 md:grid-cols-[3fr_2fr]
            items-center
          "
				>
					{/* Portrait column — md:order-last puts it on the right on desktop,
              but stays in document order (first) on mobile */}
					{image && (
						<motion.div
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								duration: 0.7,
								ease: [0.22, 1, 0.36, 1],
							}}
							className="order-first md:order-last relative mx-auto md:mx-0 w-full max-w-[340px] md:max-w-none"
						>
							<div
								aria-hidden
								className="absolute -left-3 -top-3 w-20 md:w-24 h-20 md:h-24 border-t-4 border-l-4 border-em-500 rounded-tl-2xl"
							/>
							<div
								aria-hidden
								className="absolute -right-3 -bottom-3 w-20 md:w-24 h-20 md:h-24 border-b-4 border-r-4 border-em-500 rounded-br-2xl"
							/>
							<div
								aria-hidden
								className="absolute inset-0 rounded-2xl bg-em-500/20 blur-3xl animate-pulseSlow"
							/>
							<div className="relative rounded-2xl overflow-hidden border border-em-500/40 shadow-emGlowStrong bg-ink-700 aspect-[4/5]">
								<img
									src={resolveAsset(image)}
									alt={name || "Portrait"}
									className="w-full h-full object-cover"
									onError={(e) => {
										const el = e.currentTarget;
										el.style.display = "none";
										const fallback =
											el.parentElement.querySelector(
												".portrait-fallback",
											);
										if (fallback)
											fallback.style.display = "flex";
									}}
								/>
								<div className="portrait-fallback absolute inset-0 hidden items-center justify-center font-display font-bold text-8xl text-em-400 bg-ink-800">
									{(name || "?")
										.split(/\s+/)
										.filter(
											(w) => !COURTESY_PREFIXES.test(w),
										)
										.map((w) => w[0])
										.slice(0, 2)
										.join("")}
								</div>
							</div>
						</motion.div>
					)}

					{/* Text column */}
					<div className="order-last md:order-first">
						<motion.div
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-em-500/30 bg-em-500/10 text-em-400 text-xs font-mono mb-6"
						>
							<span className="w-1.5 h-1.5 rounded-full bg-em-400 animate-pulseSlow" />
							{location
								? `Based in ${location}`
								: "Available for research & collaboration"}
						</motion.div>

						{name && (
							<motion.h1
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.05 }}
								className="font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-fog-100"
							>
								Hi, I'm{" "}
								<span className="bg-clip-text text-transparent bg-gradient-to-r from-em-400 via-em-glow to-em-500 bg-[size:200%_auto] animate-gradientShift">
									{nameAccent}
								</span>
								{nameRest && (
									<>
										<br />
										<span className="text-fog-100">
											{nameRest}
										</span>
									</>
								)}
							</motion.h1>
						)}

						{role && (
							<motion.div
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.15 }}
								className="mt-4 font-mono text-em-400 text-sm md:text-base"
							>
								<span className="text-fog-400">&gt;_</span>{" "}
								{role}
								<span className="inline-block w-[2px] h-[1em] bg-em-400 ml-1 align-middle animate-blink" />
							</motion.div>
						)}

						{tagline && (
							<motion.p
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="mt-5 text-lg md:text-xl text-fog-200 font-medium"
							>
								{tagline}
							</motion.p>
						)}

						{description && (
							<motion.p
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.25 }}
								className="mt-4 text-fog-300 leading-relaxed max-w-xl whitespace-pre-line text-justify"
							>
								{description}
							</motion.p>
						)}

						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.35 }}
							className="mt-6 flex flex-wrap items-center gap-3"
						>
							{resume && (
								<a
									href={resolveAsset(resume)}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-em-500 text-ink-900 font-semibold text-sm hover:bg-em-400 transition-colors shadow-emGlow"
								>
									Download CV
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.8"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
										<polyline points="7 10 12 15 17 10" />
										<line x1="12" y1="15" x2="12" y2="3" />
									</svg>
								</a>
							)}
							{email && (
								<a
									href={`mailto:${email}`}
									className="inline-flex justify-center items-center items-center gap-2 px-5 py-2.5 rounded-full border border-em-500/40 text-em-400 font-semibold text-sm hover:bg-em-500/10 hover:border-em-500 transition-colors"
								>
									<span className="bg-red- 400">
										Get in touch
									</span>
									<Mail className="bg-pink- 400" size={17} />
								</a>
							)}
						</motion.div>

						{socials.length > 0 && (
							<motion.ul
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.5 }}
								className="mt-4 flex flex-wrap items-center gap-2"
							>
								{socials.map(({ label, href, Icon }) => (
									<li key={label}>
										<a
											href={href}
											target={
												href.startsWith("http")
													? "_blank"
													: undefined
											}
											rel={
												href.startsWith("http")
													? "noopener noreferrer"
													: undefined
											}
											aria-label={label}
											title={label}
											className="group inline-flex items-center gap-2
                                                        px-3 py-2 rounded-full
                                                        bg-ink-700/60 border border-ink-500
                                                        text-fog-300 text-xs font-medium
                                                        hover:text-em-400 hover:bg-em-500/10 hover:border-em-500/50
                                                        transition-colors
                                                    "
										>
											<Icon
												size={15}
												className="transition-transform group-hover:scale-110"
											/>
											<span>{label}</span>
										</a>
									</li>
								))}
							</motion.ul>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
