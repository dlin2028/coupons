# %%
import numpy as np
from typing import List, Tuple
import random
from datetime import datetime, timedelta

# %%
def generate_loss_and_restock_arrays(num_loss_entries: int, max_loss_integer: int, 
                                     start_date: datetime, min_restock_days: int, max_restock_days: int) -> tuple:
    """
    Generate two lists: one for loss events and another for restock events.
    
    Parameters:
        num_loss_entries (int): Number of entries (tuples) in the loss array.
        max_loss_integer (int): The maximum value of the integer part of the loss tuples.
        start_date (datetime): The datetime from which to start generating dates.
        min_restock_days (int): Minimum number of days between restocks to ensure less frequency than losses.
        max_restock_days (int): Maximum number of days between restocks to add variability.

    Returns:
        tuple of lists: Each list contains tuples of a datetime object and an integer.
                        The first list is loss_array, and the second is restock_array.
    """
    loss_array = []
    restock_array_datetime = []
    current_date = start_date

    # Generate the loss array entries
    for _ in range(num_loss_entries):
        # Increment the date by a random number of days between 1 and 3 for each entry
        current_date += timedelta(days=random.randint(1, 3))
        # Generate a random integer between 1 and max_loss_integer
        random_int = random.randint(1, max_loss_integer)
        # Append the tuple to the loss list
        loss_array.append((current_date, random_int))

    # Generate the restock array entries
    current_date = start_date  # reset start date for synchronization
    while current_date <= loss_array[-1][0]:  # ensure we cover the whole range of loss dates
        # Add a random number of days between min_restock_days and max_restock_days
        current_date += timedelta(days=random.randint(min_restock_days, max_restock_days))
        # Append the tuple to the restock list, here max_loss_integer is used just for uniformity, modify as needed
        restock_array_datetime.append(current_date)
    restock_array_datetime.pop()
    return loss_array, restock_array_datetime

# Example usage:
num_loss_entries = 10  # Number of entries you want in the loss array
max_loss_integer = 5  # The maximum value for the integers in the loss array
start_date = datetime(2023, 1, 1)  # Starting date for the datetime data
min_restock_days = 4  # Minimum days between restocks, making it less frequent than loss occurrences
max_restock_days = 8  # Maximum days between restocks, adding variability

loss_array, restock_array_datetime = generate_loss_and_restock_arrays(num_loss_entries, max_loss_integer, start_date, min_restock_days, max_restock_days)
print("Loss Array:")
for entry in loss_array:
    print(entry)
print("\nRestock Array:")
for entry in restock_array_datetime:
    print(entry)

# %%
def total_loss_values(start, loss_events):
    if not loss_events:
        return 0  # Return 0 or None if no events are found in the interval
    total = sum(event[1] for event in loss_events)
    return total

def average_rescale_filter(start, loss_events):
    if not loss_events:
        return 0
    rescaled = []
    peak = max(event[1] for event in loss_events)
    for i in range(len(loss_events)):
        rescaled.append((loss_events[i][1] * loss_events[i][1])/peak)
    total = sum(rescaled)
    
    dte = 0
    for i in range(len(rescaled)):
        difference = loss_events[i][0] - start
        dte += difference.days * rescaled[i]
    dte = dte/total
    #total = sum(rescaled)
    return dte #total / len(rescaled)

def process_restock_and_loss_arrays(restock_array_datetime: List[datetime], loss_array: List[Tuple[datetime, int]]):
    """
    Process each restock datetime to find loss events between it and the next restock event, then calculate the average.
    
    Parameters:
        restock_array_datetime (List[datetime]): List of datetimes for restocks.
        loss_array (List[Tuple[datetime, int]]): List of tuples, each containing a datetime and an associated integer.

    Returns:
        List of averages for each interval.
    """
    loss = []
    filtered_averages = []
    # Sort the restock array for safety, though it should already be sorted.
    restock_array_datetime.sort()

    # Process each restock datetime, except for the last one
    for i in range(len(restock_array_datetime) - 1):
        start = restock_array_datetime[i]
        end = restock_array_datetime[i + 1]
        # Filter loss events that are >= start and < end
        in_interval = [loss for loss in loss_array if start <= loss[0] < end]
        total_loss = total_loss_values(start, in_interval)
        filtered = average_rescale_filter(start, in_interval)
        loss.append(total_loss)
        filtered_averages.append(filtered)
    loss_avg = sum(loss) / len(loss)
    # Handle the last interval (from last restock datetime to infinity)
    # if restock_array_datetime:
    #     start = restock_array_datetime[-1]
    #     in_interval = [loss for loss in loss_array if loss[0] >= start]
    #     avg = average_loss_values(start, in_interval)
    #     filtered = average_rescale_filter(start, in_interval)
    #     averages.append(avg)
    #     filtered_averages.append(filtered)

    return filtered_averages, loss_avg

def get_dte(restock_array_datetime, loss_array, current_time):
    '''
    restock_array_datetime contains at least the time stamps of when stock increases in the last x days
    loss_array contains the time stamps of when stock decreases and the amount decreased by in the last x days
    '''
    #find x sma of restock period (period as in frequency)
    if len(restock_array_datetime) < 2:
        raise ValueError("At least two datetimes are required to calculate an average difference.")
    
    differences = [
        (restock_array_datetime[i + 1] - restock_array_datetime[i]).total_seconds() / (24 * 3600) 
        for i in range(len(restock_array_datetime) - 1)
    ]

    avg_difference = sum(differences) / len(differences)
    dte_avgs, count_exp = process_restock_and_loss_arrays(restock_array_datetime, loss_array)
    #print(dte_avgs)
    #return 4
    dte = sum(dte_avgs) / len(dte_avgs)
    #print(current_time, restock_array_datetime)
    time_since_recent_restock = current_time - restock_array_datetime[-1]
    return (dte - time_since_recent_restock.days) % avg_difference , count_exp

    #find avg(ema) time diff between re

# %%
current_time = datetime(2023, 1, 25, 0, 0)
dte, count_exp = get_dte(restock_array_datetime,loss_array,current_time)
print(f"The expected days to expiration is: {dte:.2f} days")
print(f"The count that will expire by the expected expiration is: {count_exp:.0f}")
filtered_averages = process_restock_and_loss_arrays(restock_array_datetime, loss_array)
#print("Averages for each interval:", averages)
print("Filtered averages for ", filtered_averages)

# %%
def effect_of_discount(i):
    '''
    input i is percentage of original price
    '''
    #temp
    return 1 + 1/4000000000 * ((100 - i)**5.8)


def estimate_expected_sale_by_exp(dte, sales_array):
    '''
    sales_array - array of sales in numbers in the last 2*dte
    '''
    #create ema
    ema = np.zeros(shape=dte*2)
    ema_unit = 1/(dte*(2*dte+1))
    for i in range(dte*2):
        ema[i] = ema_unit*i
    #dot product with sales
    expected_sales_per_day = ema @ sales_array
    expected_sales_by_exp = expected_sales_per_day * dte
    return expected_sales_by_exp

def calculate_discount(dte, count_exp, item_price, sales_array):
    expected_sale_by_exp = estimate_expected_sale_by_exp(dte, sales_array)
    if count_exp - expected_sale_by_exp < 0:
        return 0, count_exp*item_price, min(expected_sale_by_exp, count_exp)*item_price
    else:
        maxv = 0
        maxi = 0
        percentage = item_price/100
        for i in range(1,101):
            discounted_price = percentage * i
            expected_sale_by_exp_discounted_price_dollar = discounted_price*min(expected_sale_by_exp*effect_of_discount(i), count_exp)
            if expected_sale_by_exp_discounted_price_dollar > maxv:
                maxv = expected_sale_by_exp_discounted_price_dollar
                maxi = i
    percent_off = 100 - maxi
    return percent_off, maxv, min(expected_sale_by_exp, count_exp)*item_price


# %%
dte = round(dte)
#count_exp = 120
item_price = 24.99
sales_array = np.random.randint(0, 16, size=2*dte)
discount, expected_sale_dollars, expected_sale_no_discount_dollars = calculate_discount(dte, count_exp, item_price, sales_array)
print("discount =", discount, "%")
print("expected sale in dollars of soon to expire items with discount $", expected_sale_dollars)
print("expected sale in dollars of soon to expire items with no discount $", expected_sale_no_discount_dollars)


