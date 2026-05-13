import { useState } from "react";

const JOURNEY_SUBSCRIPTION_ENDPOINT = "https://dashboard.iamjannisgrimm.com/api/journey-subscriptions";
const INQUIRE_EMAIL = "iamjannisgrimm@gmail.com";
const INQUIRE_SUBJECT = "Portfolio inquiry";
const CONNECT_DESCRIPTION =
  "Let's connect and work on something incredible. Follow along for updates and stay in the loop for future fit and possibilities.";

function openInquireEmail() {
  const subject = encodeURIComponent(INQUIRE_SUBJECT);
  window.location.href = `mailto:${INQUIRE_EMAIL}?subject=${subject}`;
}

export default function ConnectSection() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus("Add an email so I know where to send updates.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(JOURNEY_SUBSCRIPTION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          quote: CONNECT_DESCRIPTION,
          source: "portfolio-connect-section",
        }),
      });

      if (!response.ok) {
        throw new Error("Subscription request failed");
      }

      setEmail("");
      setIsFormVisible(false);
      setIsComplete(true);
      setStatus("");
    } catch {
      setStatus("Something went sideways. Try again in a moment or inquire directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeUpdateForm = () => {
    if (isSubmitting) {
      return;
    }

    setEmail("");
    setStatus("");
    setIsFormVisible(false);
  };

  return (
    <section className="connect-section" aria-labelledby="connect-title" data-mobile-chrome-color="#ffffff">
      <div className="connect-section__inner">
        <h2 id="connect-title" className="connect-section__title">
          {"Let's build."}
        </h2>
        <p className="connect-section__description">{CONNECT_DESCRIPTION}</p>

        <div className="connect-section__control-stage">
          {!isFormVisible && !isComplete ? (
            <div className="connect-section__actions">
              <button
                className="connect-section__button"
                type="button"
                onClick={() => setIsFormVisible(true)}
              >
                Receive updates
              </button>
              <button className="connect-section__button" type="button" onClick={openInquireEmail}>
                Inquire
              </button>
            </div>
          ) : null}

          {isFormVisible ? (
            <div className="connect-section__form-wrap">
              <form className="connect-section__form" onSubmit={handleSubmit}>
                <input
                  className="connect-section__input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <button className="connect-section__submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending" : "Opt in"}
                </button>
              </form>
              <button
                className="connect-section__back"
                type="button"
                onClick={closeUpdateForm}
                disabled={isSubmitting}
              >
                Back
              </button>
            </div>
          ) : null}
        </div>

        <p className="connect-section__status" aria-live="polite">
          {status}
        </p>

        {isComplete ? (
          <div className="connect-section__success" aria-live="polite">
            <span className="connect-section__success-mark" aria-hidden="true">
              ✓
            </span>
            <span>You are in. I will keep it short and worthwhile.</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
