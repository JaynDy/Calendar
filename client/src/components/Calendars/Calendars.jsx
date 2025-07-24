import styles from "./Calendars.module.css";
import classNames from "classnames";
import { useState, useEffect, useRef } from "react";
import { FormCalendar } from "../FormCalendar";
import { Checkbox } from "@@/Checkbox";
import { Icon } from "@@/Icon";
import { Modal } from "@@/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCurrentCalendar,
  setCurrentCalendar,
} from "../../reducers/calendarSlice";

export const Calendars = ({
  postQueryCalendars,
  addCalendar,
  deleteCalendar,
  deleteCalendarWithEvents,
  updateCalendar,
}) => {
  const dispatch = useDispatch();
  const currentCalendar = useSelector(
    (state) => state.calendar.currentCalendar
  );
  const [hoveredCalendarId, setHoveredCalendarId] = useState(null);
  const [isFormCalendarVisible, setIsFormCalendarVisible] = useState(false);
  const [isFormCalendarDeleteVisible, setIsFormCalendarDeleteVisible] =
    useState(false);
  const [error, setError] = useState({});
  const defaultColor = "#DFC45A";
  const hasUpdatedColorRef = useRef(false);

  useEffect(() => {
    if (postQueryCalendars) {
      const defaultCalendar = postQueryCalendars.find(
        (calendar) => calendar.isDefault
      );

      if (defaultCalendar) {
        dispatch(
          setCurrentCalendar({
            ...defaultCalendar,
            color: defaultCalendar.color || defaultColor,
          })
        );

        if (!defaultCalendar.color && !hasUpdatedColorRef.current) {
          updateCalendar.mutateAsync({
            id: defaultCalendar.id,
            updatedText: defaultCalendar.name,
            updatedColor: defaultCalendar.color || defaultColor,
            updatedIsChecked: defaultCalendar.isChecked,
            updatedIsDefault: defaultCalendar.isDefault,
          });
          hasUpdatedColorRef.current = true;
        }
      }
    }
  }, [postQueryCalendars.data, dispatch, updateCalendar]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!currentCalendar.name.trim()) {
      alert("Please enter a title for the calendar.");
      return;
    }

    if (!currentCalendar.name.trim()) {
      validationErrors.name = "Title is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      const checkedStatus = !!currentCalendar.color;
      const calendarData = {
        name: currentCalendar.name,
        color: currentCalendar.color || defaultColor,
        isChecked: checkedStatus,
        isDefault: currentCalendar.isDefault || false,
      };

      if (currentCalendar.id) {
        await updateCalendar.mutateAsync({
          id: currentCalendar.id,
          updatedText: calendarData.name,
          updatedColor: calendarData.color,
          updatedIsChecked: calendarData.isChecked,
          updatedIsDefault: calendarData.isDefault,
        });
      } else {
        await addCalendar.mutateAsync(calendarData);
      }
    } finally {
      dispatch(clearCurrentCalendar());
      setIsFormCalendarVisible(false);
    }
  };

  const handleDeleteCalendar = (id) => {
    deleteCalendar.mutate(id, {
      onSuccess: () => {
        console.log(`Successfully deleted calendar ID: ${id}`);
      },
      onError: (error) => {
        console.error("Error deleting calendar:", error);
      },
    });
  };

  const handleDeleteCalendarWithEvents = (calendarId) => {
    deleteCalendarWithEvents.mutate(calendarId, {
      onSuccess: () => {
        handleDeleteCalendar(calendarId);
      },
      onError: (error) => {
        console.error("Error deleting events:", error);
      },
    });
  };

  const handleToggleColor = async (id, currentColor, currentIsChecked) => {
    try {
      if (!currentColor) {
        return;
      }
      const newColor = currentColor ? currentColor : currentCalendar.color;
      const newIsChecked = !currentIsChecked;

      await updateCalendar.mutateAsync({
        id,
        updatedColor: newColor,
        updatedIsChecked: newIsChecked,
      });
    } catch (error) {
      console.error("Error toggling checked:", error);
    }
  };

  const handleEditClick = (calendar) => {
    dispatch(setCurrentCalendar(calendar));
    setIsFormCalendarVisible(true);
    setIsFormCalendarDeleteVisible(false);
  };

  const handleDeleteClick = (calendar) => {
    dispatch(setCurrentCalendar(calendar));
    setIsFormCalendarVisible(false);
    setIsFormCalendarDeleteVisible(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setIsFormCalendarVisible(false);
  };

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setIsFormCalendarDeleteVisible(false);
  };

  useEffect(() => {
    if (!setIsFormCalendarVisible) {
      dispatch(clearCurrentCalendar());
    }
  }, [setIsFormCalendarVisible, dispatch]);

  // console.log("PostQueryCalendars:", postQueryCalendars);

  return (
    <>
      <div className={styles.calendarAppContainer}>
        <div className={styles.formContainer}>
          <span className={styles.titleCalendars}>My calendar</span>
          <Icon
            name="Plus"
            className={styles.imgPlus}
            onClick={() => {
              dispatch(clearCurrentCalendar());
              setIsFormCalendarVisible(true);
            }}
          />
        </div>
        <FormCalendar
          title={currentCalendar.id ? "Edit calendar" : "Create calendar"}
          currentCalendar={currentCalendar}
          isFormVisible={isFormCalendarVisible}
          setIsFormVisible={setIsFormCalendarVisible}
          handleSubmit={handleSubmit}
          onClose={handleClose}
          error={error}
        />

        <div className={styles.calendarsContainer}>
          {postQueryCalendars &&
            postQueryCalendars.map((calendar) => (
              <ul key={calendar.id}>
                <li key={calendar.id} className={styles.calendarItem}>
                  <div
                    className={classNames(styles.checkBoxContainer, {
                      [styles.hovered]: hoveredCalendarId === calendar.id,
                    })}
                    onMouseEnter={() => setHoveredCalendarId(calendar.id)}
                    onMouseLeave={() => setHoveredCalendarId(null)}
                  >
                    <Checkbox
                      id={calendar.id}
                      iconChecked="CheckboxFill"
                      iconUnchecked="CheckboxLine"
                      color={calendar.color || defaultColor}
                      checked={calendar.isChecked}
                      onChange={() =>
                        handleToggleColor(
                          calendar.id,
                          calendar.color,
                          calendar.isChecked
                        )
                      }
                    />

                    <div className={styles.textContainer}>
                      <span className={styles.editSpan}>{calendar.name}</span>
                    </div>

                    <div className={styles.buttonContainer}>
                      <>
                        {hoveredCalendarId === calendar.id && (
                          <>
                            {!calendar.isDefault && (
                              <>
                                <Icon
                                  name="Delete"
                                  onClick={() => handleDeleteClick(calendar)}
                                  className={styles.imgDelete}
                                />
                              </>
                            )}

                            <Icon
                              name="Edit"
                              onClick={() => handleEditClick(calendar)}
                              className={styles.imgEdit}
                            />
                          </>
                        )}
                      </>
                    </div>
                  </div>
                </li>

                {!isFormCalendarVisible &&
                  !calendar.isDefault &&
                  calendar.id === currentCalendar.id && (
                    <Modal
                      onClose={handleDeleteClose}
                      title="Delete calendar"
                      icon="Close"
                      children={`Are you sure you want to delete ${currentCalendar.name}? You'll no longer have access to this calendar and its events`}
                      isFormDeleteVisible={isFormCalendarDeleteVisible}
                      setIsFormDeleteVisible={setIsFormCalendarDeleteVisible}
                      onDeleteCalendar={() =>
                        handleDeleteCalendarWithEvents(currentCalendar.id)
                      }
                    />
                  )}
              </ul>
            ))}
        </div>
      </div>
    </>
  );
};
